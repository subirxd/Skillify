import React, { useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'; // Import the useDropzone hook
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";

// This component handles both image and video uploads
export default function CourseThumbnail({
    name,
    label,
    register,
    errors,
    setValue,
    getValues,
    video = false, // Use a boolean to differentiate between image and video
    viewData = null,
    editData = null,
}) {
    const { course } = useSelector((state) => state.course);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(
        viewData ? viewData : editData ? editData : ""
    );
    const inputRef = useRef(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        // The onDrop callback is called when files are dropped or selected
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0]; // Get the first file from the acceptedFiles array
            if (file) {
                setSelectedFile(file); // Set the selected file in local state
                previewFile(file); // Create a preview URL
            }
        },
        // Set the accepted file types based on the 'video' prop
        accept: !video
            ? { "image/*": [".jpeg", ".jpg", ".png"] } // Accept images if it's not a video upload
            : { "video/*": [".mp4", ".mov"] }, // Accept videos if it is a video upload
    });

    // --- Create a preview URL from the selected file ---
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // Read the file as a data URL (Base64 string)
        reader.onloadend = () => {
            setPreviewSource(reader.result); // Set the preview source in local state
        };
    };

    // --- Register the field with react-hook-form and manage its value ---
    useEffect(() => {
        // This is the correct way to register a custom input with react-hook-form
        register(name, { required: true });

        // If in edit mode, and there's existing data, set it as the preview
        if (editData || viewData) {
            setPreviewSource(editData || viewData);
        }

        // Clean up the URL when the component unmounts to prevent memory leaks
        return () => {
            if (previewSource) {
                URL.revokeObjectURL(previewSource);
            }
        };
    }, [name, editData, viewData, register, getValues]);

    // --- Update react-hook-form's state when the local file state changes ---
    useEffect(() => {
        if (selectedFile) {
            setValue(name, selectedFile); // Set the file object as the value for this form field
        }
    }, [selectedFile, name, setValue]);

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label} {!viewData && <sup className="text-pink-200">*</sup>}
            </label>
            <div
                className={`${
                    isDragActive ? "bg-richblack-600" : "bg-richblack-700"
                } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
                {...getRootProps()} // Apply dropzone props to the container
            >
                {previewSource ? (
                    <div className="flex flex-col p-6">
                        
                        {!video ? (
                            <img
                                src={previewSource}
                                alt="Preview"
                                className="h-full w-full rounded-md object-cover"
                            />
                        ) : (
                            <Player aspectRatio="16:9" playsInline src={previewSource} />
                        )}
                        {!viewData && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewSource("");
                                    setValue(name, null); // Reset the form value
                                }}
                                className="mt-3 text-richblack-400 underline cursor-pointer"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex w-full flex-col items-center p-6">
                        <input {...getInputProps()} ref={inputRef} /> {/* Apply input props to the hidden input */}
                        <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                            <FiUploadCloud className="text-2xl text-yellow-50" />
                        </div>
                        <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                            Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                            <span className="font-semibold text-yellow-50"
                            onClick={(e) => {
                                e.preventDefault();
                                inputRef.current.click();
                            }}
                            >Browse</span> a file
                        </p>
                        <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
                            <li>Aspect ratio 16:9</li>
                            <li>Recommended size 1024x576</li>
                        </ul>
                    </div>
                )}
            </div>
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    );
}