import { IoSearchOutline } from "react-icons/io5";
const Searchbar = () => {
  return (
    <div className="relative min-w-60 bg-theme_secondary_black/20 border-1 border-white/20 h-10 xxl:h-12 rounded-lg grow font-kustom">
      <IoSearchOutline className="absolute top-1/2 left-4 -translate-y-1/2 text-lg xxl:text-xl" />
      <input
        type="text"
        placeholder="Search for your links..."
        name="link_search"
        className="w-full h-full outline-hidden border-0 px-6 pl-12"
      />
    </div>
  );
};

export default Searchbar;
