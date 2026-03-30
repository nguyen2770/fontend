import { useLocation, useNavigate } from "react-router-dom";

export const useCustomNav = () => {
  const nav = useNavigate();
  const location = useLocation();
  const navigate = (url) => {
    if (url != -1) {
      const module = location.pathname.split("/")[1];
      // nav(`/${module}${url}`);
      nav(`${url}`);
    } else nav(-1);
  };
  return navigate;
};
