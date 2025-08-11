import IconButton from "./IconButton";

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6 shadow-lg animate-scaleIn">
        {/* Title */}
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData?.text1}
        </p>

        {/* Subtitle */}
        <p className="mt-3 mb-5 leading-6 text-richblack-200">
          {modalData?.text2}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <IconButton
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
            customClasses="flex-1 justify-center"
          />
          <button
            className="flex-1 cursor-pointer rounded-md bg-richblack-200 py-2 px-5 font-semibold text-richblack-900 transition-all duration-200 hover:bg-richblack-300"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}
