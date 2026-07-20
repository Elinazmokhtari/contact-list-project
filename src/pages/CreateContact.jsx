import { useNavigate } from "react-router";
import ContactForm from "../components/ContactForm";

export default function CreateContact() {
  const navigate = useNavigate();
  return (
    <div className="bg-pink-50 w-full h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full bg-white shadow-sm px-4 py-3 flex items-center gap-3 fixed top-0">
        <button
          onClick={() => navigate("/contacts")}
          className="text-pink-400 text-xl"
        >
          ←
        </button>
        <p className="font-semibold">Contacts</p>
      </div>
      <div className="pt-22 flex justify-center items-center ">
        <ContactForm />
      </div>
    </div>
  );
}
