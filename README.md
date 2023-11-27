# 介绍
> 使用 react-rnno 解耦应用中的逻辑和弹窗

# 用法

## 在app顶层嵌套

```javascript

import { ORNNAdaptor } from "react-ornn";
import UserVerifyModal from "components/UserVerifyModal";

// 注册view
const views = {
    UserVerifyModal
}

const App = () => {
    return (
        <ORNNAdaptor views={views}>
            ...
        </ORNNAdaptor>
    )
}

```

## UserVerifyModal 示例（自定义的业务抽象）
> 以用户验证场景为例

```javascript

const UserVerifyModal = props => {
    // promiseHandler 和 visible 是 ORNNAdaptor 注入的参数
    const { promiseHandler, visible, ...rest } = props;

    // rest 为其他参数
    const { ... } = rest;

    const _onSuccess = (res) => {
        promiseHandler?.resolve(res);
    };

    const _onFail = (res) => {
        promiseHandler?.resolve(res);
    };

    const onSubmit = async () => {
        ...
        const { ... } = await api();
        if(success) {
            _onSuccess({ ... })
        } else {
            _onFail({ ... })
        }
    }

    const onCancel = async () => {
        // 你可以定制你的resolve的内容，区分IO成功后的关闭和用户主动关闭行为
        promiseHandler?.resolve({ isCancel: true });
    }

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            onOk={onSubmit}
            {...}
        >
            <Form {...}>
                ...
            </Form>
        </Modal>
    )

};

export default UserVerifyModal;

```

## 在业务里使用

```javascript

import { useORNN } from "react-ornn";

const YourView = () => {

    // 第一个参数为目标视图的名字，第二个参数为依赖的变化的状态，比如 轮训影响的值
    // 其他值尽量在调用 showUserVerify 传进去
    const showUserVerify = useORNN("UserVerifyModal", { ... });

    // 提交之前需要进行用户验证，这里只需要把 UserVerifyModal 需要的参数传进去
    // 在 UserVerifyModal 处理完成之后，只需要按照自己的需要 resolve响应的值即可
    const onSubmit = async (restParams) => {
        const res = await showUserVerify({
            restParams,
            ....
        });

        if(res...) {

        } else {
            ...
        }
    }

};

```