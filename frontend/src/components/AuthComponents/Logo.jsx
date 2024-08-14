// import logo from "../../assets/logo.png";
import applogo from "../../assets/Applogo.png";

// Define the Logo component
const Logo = () => {
  return (
    <div className="flex flex-row items-center brightness-110">
      {/* Display the logo image with appropriate styling */}
      <img className="h-14 my-5 w-auto" src={applogo} alt="Your Company" />
    </div>
  );
};

// Export the Logo component as the default export
export default Logo;
