import { useEffect, useState } from "react";

const useSticky = () => {
    const [sticky,setSticky] = useState(false);

    const stickyHeader = () => {
        window.scrollY > 80 ? setSticky(true) : setSticky(false);
    }
    useEffect(() => {
        window.addEventListener('scroll',stickyHeader)
    },[]);

    return {
        sticky,
    }

}

export default useSticky;