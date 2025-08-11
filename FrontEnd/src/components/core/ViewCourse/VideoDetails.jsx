import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../Services/operations/courseAPI';
import { setCompletedLectures, updateCompletedLectures } from '../../../Slices/viewCourseSlice';
import ReactPlayer from 'react-player';
import { AiFillPlayCircle } from 'react-icons/ai';
import IconButton from '../../Common/IconButton';

function VideoDetails() {

  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const player = useRef();

  const { token } = useSelector((state) => state.auth);
  const { courseEntireData, courseSectionData, completedLectures } = useSelector((state) => state.viewCourse);
  const { user } = useSelector((state) => state.profile);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseSectionData.length) return;
    if (!courseId || !sectionId || !subSectionId) {
      navigate("/dashboard/enrolled-courses");
      return;
    }

    const filteredData = courseSectionData.filter(
      (course) => course._id.toString() === sectionId.toString()
    );

    const filterVideoData = filteredData?.[0]?.subSection.filter(
      (data) => data._id.toString() === subSectionId.toString()
    );

    console.log(filterVideoData);

    if (filterVideoData?.length) {
      setVideoData(filterVideoData[0]);
      setVideoEnded(false);
    }
  }, [courseSectionData, sectionId, subSectionId, courseId]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const currentsubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);
    return currentSectionIndex === 0 && currentsubSectionIndex === 0;
  };

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const totalSection = courseSectionData.length;
    const currentsubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);
    const noOfSubSection = courseSectionData[currentSectionIndex]?.subSection.length;
    return currentSectionIndex === totalSection - 1 && currentsubSectionIndex === noOfSubSection - 1;
  };

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId);
    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length;
    const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx + 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndx + 1].subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    }
  };

  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const currentsubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

    if (currentsubSectionIndex !== 0) {
      const previousSubSectionId = courseSectionData[currentSectionIndex].subSection[currentsubSectionIndex - 1]._id;
      navigate(`/view-course/${courseId}/section/${courseSectionData[currentSectionIndex]._id}/sub-section/${previousSubSectionId}`);
    } else {
      const prevSubsectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubsectionLength - 1]._id;
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    try {
      const response = await markLectureAsComplete(courseId, subSectionId, user._id, token);
      if (response) {
        const index = response.courseProgress.findIndex(progress => progress.courseID === courseId);
        const completedVideos = index !== -1 ? response.courseProgress[index].completedVideos : [];
        dispatch(setCompletedLectures(completedVideos));
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <div>No data found...</div>
      ) : (
        <div className="relative w-[50%] h-[100%] bg-black ml-10">
          {/* The Player */}
          <ReactPlayer
            ref={player}
            onPlay={() => setVideoEnded(false)}
            src={videoData?.videoUrl}
            controls={true}
            playsinline
            onEnded={() => setVideoEnded(true)}
            style={{ width: '100%', height: '100%', aspectRatio: '16/9' }}
          />

          {/* Overlay */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0,0,0,0.9), rgba(0,0,0,0.7), rgba(0,0,0,0.3))",
              }}
              className="absolute inset-0 z-[100] flex flex-col items-center justify-center gap-4 text-white"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconButton
                  disabled={loading}
                  onclick={handleLectureCompletion}
                  text={!loading ? "Mark as Completed" : "Loading..."}
                />
              )}
              <IconButton
                disabled={loading}
                onclick={() => {
                   player.current.src="";

                   player.current.src=`${videoData?.videoUrl}`;
                   setVideoEnded(false);
                   
                }}
                text="Rewatch"
              />
              <div className="mt-10 flex gap-x-2">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="cursor-pointer rounded-md bg-richblack-800 px-[20px] py-[8px] font-semibold text-richblack-5"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="cursor-pointer rounded-md bg-richblack-800 px-[20px] py-[8px] font-semibold text-richblack-5"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData.title}</h1>
      <p className="pt-2 pb-6">{videoData.description}</p>
    </div>
  );
}

export default VideoDetails;