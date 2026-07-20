import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../utils/path";
import { useNavigate, useParams } from "react-router";
import getApiHeaders from "../utils/helper";

export default function SingleContact() {
  const token = localStorage.getItem("token");
  const param = useParams();
  const navigate = useNavigate();
  const [singleContactData, setSingleContactData] = useState(undefined);
  useEffect(() => {
    axios
      .get(`${API.contacts}/${param.id}`, {
        headers: getApiHeaders(),
      })
      .then((res) => setSingleContactData(res.data))
      .catch((err) => console.log(err, "err in single contact "));
  }, [param.id, token]);

  if (!singleContactData) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-pink-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="w-full bg-white shadow-sm px-4 py-3 flex items-center gap-3 fixed top-0 z-10">
        <button
          onClick={() => navigate("/contacts")}
          className="text-pink-400 text-xl"
        >
          ←
        </button>
        <p className="font-semibold">Contact Info</p>
      </div>

      <div className="pt-16 flex flex-col items-center p-6 gap-6">
        <div className="mt-6 size-24 rounded-full bg-pink-200 flex items-center justify-center text-pink-500 text-4xl font-bold shadow-md">
          {singleContactData.first_name?.[0].toUpperCase()}
        </div>

        <p className="text-2xl font-bold text-stone-700">
          {singleContactData.first_name} {singleContactData.last_name}
        </p>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="text-pink-400 text-xl">📞</span>
            <div>
              <p className="text-xs text-stone-400">Phone</p>
              <p className="text-stone-700">{singleContactData.phone}</p>
            </div>
          </div>

          {singleContactData.email && (
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <span className="text-pink-400 text-xl">✉️</span>
              <div>
                <p className="text-xs text-stone-400">Email</p>
                <p className="text-stone-700">{singleContactData.email}</p>
              </div>
            </div>
          )}

          {singleContactData.birthdate && (
            <div className="flex items-center gap-3">
              <span className="text-pink-400 text-xl">🎂</span>
              <div>
                <p className="text-xs text-stone-400">Birthday</p>
                <p className="text-stone-700">{singleContactData.birthdate}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
