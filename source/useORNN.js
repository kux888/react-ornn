import { useContext, useEffect, useCallback, useRef } from "react";
import ORNNContext from "./ORNNContext";
import { v4 as uuidv4 } from 'uuid';

const useORNN = (id, deps = {}) => {
    const uuid = useRef(null);
    const { show, updateOrMemoProps } = useContext(ORNNContext);

    const _show = useCallback((nextProps) => {
        return show(uuid.current, nextProps)
    }, [id]);
    
    useEffect(() => {
        if(!uuid.current) {
            uuid.current = `${id}%${uuidv4()}`;
        }
        updateOrMemoProps(uuid.current, deps);
    }, [deps, id]);

    return _show;
};

export default useORNN;