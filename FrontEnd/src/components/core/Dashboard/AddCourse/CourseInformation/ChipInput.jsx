import React, { useEffect, useState } from 'react'

function ChipInput({label, name, placeholder, register, errors, setValue, getValues}) {
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);

    useEffect(() => {
        register(name, {
            required: true,
            validate: (value) => value.length > 0,
        });
    }, []);

    useEffect(() => {
        setValue(name, requirementList);
    }, [requirementList, name, setValue]);

   
    const handleAddTags = () => {
        if (requirement) {
            setRequirementList((prevData) => [...prevData, requirement]);
            setRequirement("");
        }
    };

    const handleRemoveTag = (indexToRemove) => {
        setRequirementList((prevData) => 
            prevData.filter((_, index) => index !== indexToRemove)
        );
    };

    return (
        <div>
            
            <label htmlFor={name}
            
            className="text-sm text-richblack-5"
            >
                {label}
                <sup className="text-pink-200">*</sup>
            </label>

           
            {requirementList.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2">
                    {requirementList.map((tag, index) => (
                        <div key={index}
                             className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
                        >
                           
                            <span>{tag}</span>
                           
                            <button
                                type="button" // Important to prevent form submission
                                onClick={() => handleRemoveTag(index)}
                                className="text-richblack-5 focus:outline-none"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}

           
            <input
                type='text'
                id={name}
                name={name}
                placeholder={placeholder} // Using the placeholder prop
                value={requirement}
                className="form-style w-full"
                onChange={(e) => setRequirement(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleAddTags();
                    }
                }}
            />

            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {errors[name].message || "Please add at least one tag."}
                </span>
            )}
        </div>
    );
}

export default ChipInput;