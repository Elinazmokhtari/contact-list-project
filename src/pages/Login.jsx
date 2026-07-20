import Button from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import userSlice from "../redux/slices/userSlice";
import user from "../assets/img/user.png";
import { API } from "../utils/path";
import getApiHeaders from "../utils/helper";
const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })
  .required();

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onsubmit = (data) => {
    return axios
      .post(API.login, data)
      .then((res) => {
        navigate("/");
        localStorage.setItem("token", res.data.token);
        axios
          .get(API.me, {
            headers: getApiHeaders(),
          })
          .then((res) =>
            dispatch(userSlice.actions.handleSaveUser(res.data.token))
          )
          .catch((err) => console.log(err, "err in me "));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="h-screen w-full bg-pink-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-[400px] bg-white flex flex-col p-4 items-center justify-center gap-3 rounded-4xl  shadow-xl shadow-[#0000000D]"
      >
        <img src={user} alt="" className="size-20" />
        <p className="text-[24px] text-pink-400 mt-5 font-bold">Login</p>
        <div className="w-full gap-2 flex flex-col ">
          <Input placeholder={"Enter your Email"} {...register("email")} />
          <p className="text-pink-400 text-[13px]">{errors.email?.message}</p>
          <Input
            placeholder={"Enter your Password"}
            {...register("password")}
          />
          <p className="text-pink-400 text-[13px]">
            {errors.password?.message}
          </p>
        </div>
        <Button
          text={"Login"}
          disabled={isSubmitting}
          className={"p-4 mt-4  "}
        />
      </form>
    </div>
  );
}

export default Login;
