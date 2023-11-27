import React, {
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
    useMemo,
    useCallback,
    cloneElement,
    useEffect,
    Children
} from "react";
import ORNNContext from "./ORNNContext";

const EmptyUI = () => null;

const setMultiState = nextPartial => prev => {
    const next = { ...prev, ...nextPartial };
    return next;
}

const ORNNContainer = forwardRef(({ children }, ref) => {

    const [visible, setVisible] = useState({});
    const [promiseHandler, setPromiseHandler] = useState({});
    const [compNextProps, setCompNextProps] = useState({});

    const updateState = useCallback((id, nextProps) => {
        setCompNextProps(compPrevProps => {
            const next = { ...compPrevProps, [id]: { ...(compPrevProps[id] || {}), ...nextProps } };
            return next;
        });
    }, [])

    const show = useCallback((id, handler, nextProps) => {
        setVisible(setMultiState({ [id]: true }));
        setPromiseHandler(setMultiState({ [id]: handler }));
        updateState(id, nextProps);
    }, [])

    const hide = useCallback((id) => {
        setVisible(setMultiState({ [id]: false }));
    }, [])

    useImperativeHandle(ref, () => ({
        show,
        hide,
        updateState,
    }));

    return Children.map(children, child => {
        const token = child.props.token;
        return cloneElement(child, {
            visible: visible[token],
            promiseHandler: promiseHandler[token],
            ...(compNextProps[token] || {}),
            ...child.props,
        })
    });
});

const stackPush = (id) => (prev) => {
    const next = [...prev];
    next.push(id);
    return next;
}

const stackPop = (prev) => {
    const next = [...prev];
    next.pop();
    return next;
}

const ORNNAdaptor = props => {

    const { views, children } = props;
    const [idStack, setIdStack] = useState([]);
    const ref = useRef(null);
    const memorizedPropsBeforeShow = useRef({});
    const idStackRef = useRef([]);

    useEffect(() => {
        idStackRef.current = idStack;
    }, [idStack]);

    const show = useCallback(async (_id, _uiProps) => {
        setIdStack(stackPush(_id));
        return new Promise((resolve, reject) => {
            ref?.current?.show(
                _id,
                {
                    resolve: (data) => {
                        resolve(data);
                        ref?.current?.hide(_id);
                        setTimeout(() => {
                            setIdStack(stackPop);
                        }, 100)
                    },
                    reject: (error) => {
                        reject(error);
                        ref?.current?.hide(_id);
                        setTimeout(() => {
                            setIdStack(stackPop);
                        }, 100)
                    }
                },
                {...(memorizedPropsBeforeShow.current[_id] || {}), ...(_uiProps || {})}
            );
        });
    }, []);

    const updateOrMemoProps = useCallback((_id, nextProps) => {
        if(idStackRef.current.includes(_id)) {
            ref?.current?.updateState(_id, nextProps);
        } else {
            const prevProps = memorizedPropsBeforeShow.current[_id] || {};
            memorizedPropsBeforeShow.current[_id] = { ...prevProps, ...nextProps };
        }
    }, [])

    const contextValue = useMemo(() => {
        return {
            show,
            updateOrMemoProps,
        }
    }, [show, updateOrMemoProps]);

    return (
        <ORNNContext.Provider value={contextValue}>
            {children}
            <ORNNContainer ref={ref}>
                {
                    (idStack.length === 0)
                        ? null
                        : idStack.map(id => {
                            const UIComponent = views[id] || EmptyUI;
                            return <UIComponent key={id} token={id} />
                        })
                }
            </ORNNContainer>
        </ORNNContext.Provider>
    )
};

export default ORNNAdaptor;