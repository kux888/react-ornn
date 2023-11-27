import { useContext, useEffect, useCallback } from "react";
import ORNNContext from "./ORNNContext";

const useORNN = (id, deps = {}) => {
    const { show, updateOrMemoProps } = useContext(ORNNContext);

    const _show = useCallback((nextProps) => {
        show(id, nextProps)
    }, [id]);
    
    useEffect(() => {
        updateOrMemoProps(id, deps);
    }, [deps, id]);

    return _show;
};

export default useORNN;