const DetailItem = ({ label, value }) => (
  <div>
    <p className="mb-1 text-xs text-richblack-400 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-medium text-richblack-5">{value}</p>
  </div>
);

export default DetailItem