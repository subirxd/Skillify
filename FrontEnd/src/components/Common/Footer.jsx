import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/Logo/logo-white.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
<div className="bg-gradient-to-b from-richblack-900 to-richblack-800 border-t-2 border-t-blue-200">
  <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-max-content text-richblack-400 leading-6 mx-auto relative py-14">
    <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-richblack-700">
      
      {/* Section 1 */}
      <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
        
        {/* Company */}
        <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
          <img src={Logo} alt="" className="object-contain hover:scale-105 transition-transform duration-300" />
          <h1 className="text-richblack-50 font-semibold text-[16px]">Company</h1>
          <div className="flex flex-col gap-2">
            {["About", "Careers", "Affiliates"].map((ele, i) => (
              <Link 
                key={i} 
                to={ele.toLowerCase()}
                className="text-[14px] hover:text-blue-200 hover:drop-shadow-glow transition-all duration-200"
              >
                {ele}
              </Link>
            ))}
          </div>
          <div className="flex gap-3 text-lg">
            {[FaFacebook, FaGoogle, FaTwitter, FaYoutube].map((Icon, idx) => (
              <Icon 
                key={idx} 
                className="hover:text-pink-200 hover:scale-110 transition-all duration-200 cursor-pointer" 
              />
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
          <h1 className="text-richblack-50 font-semibold text-[16px]">Resources</h1>
          <div className="flex flex-col gap-2 mt-2">
            {Resources.map((ele, index) => (
              <Link 
                key={index} 
                to={ele.split(" ").join("-").toLowerCase()} 
                className="text-[14px] hover:text-blue-200 hover:drop-shadow-glow transition-all duration-200"
              >
                {ele}
              </Link>
            ))}
          </div>
          <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">Support</h1>
          <Link 
            to="/help-center" 
            className="text-[14px] hover:text-blue-200 hover:drop-shadow-glow transition-all duration-200 mt-2"
          >
            Help Center
          </Link>
        </div>

        {/* Plans + Community */}
        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
          <h1 className="text-richblack-50 font-semibold text-[16px]">Plans</h1>
          <div className="flex flex-col gap-2 mt-2">
            {Plans.map((ele, index) => (
              <Link 
                key={index} 
                to={ele.split(" ").join("-").toLowerCase()} 
                className="text-[14px] hover:text-blue-200 hover:drop-shadow-glow transition-all duration-200"
              >
                {ele}
              </Link>
            ))}
          </div>
          <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">Community</h1>
          <div className="flex flex-col gap-2 mt-2">
            {Community.map((ele, index) => (
              <Link 
                key={index} 
                to={ele.split(" ").join("-").toLowerCase()} 
                className="text-[14px] hover:text-blue-200 hover:drop-shadow-glow transition-all duration-200"
              >
                {ele}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
        {FooterLink2.map((ele, i) => (
          <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
            <h1 className="text-richblack-50 font-semibold text-[16px]">{ele.title}</h1>
            <div className="flex flex-col gap-2 mt-2">
              {ele.links.map((link, index) => (
                <Link 
                  key={index} 
                  to={link.link} 
                  className="text-[14px] hover:text-blue-200 hover:drop-shadow-glow transition-all duration-200"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Bottom Footer */}
  <div className="flex flex-row items-center justify-between w-11/12 max-w-max-content text-richblack-400 mx-auto pb-14 text-sm border-t border-richblack-700 pt-5">
    <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
      <div className="flex flex-row">
        {BottomFooter.map((ele, i) => (
          <Link
            key={i}
            to={ele.split(" ").join("-").toLowerCase()}
            className={`px-3 hover:text-blue-200 hover:drop-shadow-glow transition-all duration-200 ${
              BottomFooter.length - 1 !== i && "border-r border-richblack-700"
            }`}
          >
            {ele}
          </Link>
        ))}
      </div>
      <div className="text-center">Made with ❤️ Sudipta © 2025 Skillify</div>
    </div>
  </div>
</div>

  );
};

export default Footer;