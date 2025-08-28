const AuthInput = ({ type = "text", placeholder, value, onChange }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FE2C55] text-black placeholder-gray-500"
            value={value}
            onChange={onChange}
            style={{ backgroundColor: "#F5FFFA" }}
        />
    );
};

export default AuthInput;