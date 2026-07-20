import Input from "./Input";
import Button from "./Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextArea from "./TextArea";
import axios from "axios";
import { API } from "../utils/path";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import getApiHeaders from "../utils/helper";

const schema = yup
  .object({
    first_name: yup.string().min(3).required(),
    last_name: yup.string().max(20).required(),
    birthdate: yup.string().notRequired(),
    phone: yup
      .string()
      .required()
      .matches(/^09\d{9}$/, "shoud be started with 09, and valid phone number"),
    email: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .email("email isn't valid"),
    picture: yup
      .mixed()
      .test("fileSize", "حجم عکس نباید بیشتر از 1 مگابایت باشد", (value) => {
        if (!value || value.length === 0) return true;
        return value[0].size <= 1024 * 1024;
      })
      .test("fileType", "فقط فایل تصویری مجاز است", (value) => {
        if (!value || value.length === 0) return true;
        return value[0].type.startsWith("image/");
      }),
    description: yup.string().notRequired(),
  })
  .notRequired();

export default function ContactForm() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const params = useParams();
  console.log("ContactForm rendered, params:", params);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log("current errors:", errors);

  useEffect(() => {
    if (params.id) {
      axios
        .get(API.editcontact(params.id), {
          headers: getApiHeaders(true),
        })
        .then((res) => {
          reset({
            ...res.data,
            picture: undefined,
          });
        })
        .catch((err) => console.log("Error fetching contact:", err));
    }
  }, [params.id, token, reset]);

  const onSubmit = (data) => {
    console.log("onSubmit fired with data:", data);
    const formData = new FormData();

    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("phone", data.phone);

    if (data.birthdate) formData.append("birthdate", data.birthdate);
    if (data.email) formData.append("email", data.email);
    if (data.description) formData.append("description", data.description);

    if (data.picture && data.picture.length > 0) {
      formData.append("picture", data.picture[0]);
    }

    if (params.id) {
      formData.append("_method", "PUT");

      return axios
        .post(API.editcontact(params.id), formData, {
          headers: getApiHeaders(true),
        })
        .then(() => navigate("/contacts"))
        .catch((err) => {
          console.log(err.response?.status);
          console.log(err.response?.data);
        });
    }

    return axios
      .post(API.contacts, formData, { headers: getApiHeaders() })
      .then((res) => {
        return res, navigate("/contacts");
      })
      .catch((err) => console.log(err, "err in form data api"));
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-5 rounded-4xl"
      >
        <div className="grid sm:grid-cols-2 gap-4 *:grid *:gap-1">
          <div>
            <p>First Name</p>
            <Input placeholder="enter your name" {...register("first_name")} />
            <p className="text-pink-400 text-[13px]">
              {errors.first_name?.message}
            </p>
          </div>

          <div>
            <p>Last Name</p>
            <Input
              placeholder="enter your last name"
              {...register("last_name")}
            />
            <p className="text-pink-400 text-[13px]">
              {errors.last_name?.message}
            </p>
          </div>

          <div>
            <p>Birth</p>
            <Input type="date" {...register("birthdate")} />
            <p className="text-pink-400 text-[13px]">
              {errors.birthdate?.message}
            </p>
          </div>

          <div>
            <p>Phone</p>
            <Input placeholder="enter your phone" {...register("phone")} />
            <p className="text-pink-400 text-[13px]">{errors.phone?.message}</p>
          </div>

          <div>
            <p>Email</p>
            <Input placeholder="enter your email" {...register("email")} />
            <p className="text-pink-400 text-[13px]">{errors.email?.message}</p>
          </div>

          <div>
            <p>Picture</p>
            <Input type="file" accept="image/*" {...register("picture")} />
            <p className="text-pink-400 text-[13px]">
              {errors.picture?.message}
            </p>
          </div>
        </div>

        <div className="my-4 flex flex-col gap-1">
          <p>Description</p>
          <TextArea
            rows={3}
            {...register("description")}
            className="w-full rounded-[10px] p-3 border border-stone-400 outline-none focus:border-pink-400"
          />
          <p className="text-pink-400 text-[13px]">
            {errors.description?.message}
          </p>
        </div>
        <Button
          text={params.id ? "update contact" : "add contact"}
          className={"p-4"}
          disabled={isSubmitting}
          onClick={() => console.log("button clicked!", isSubmitting)}
        />
      </form>
    </div>
  );
}
