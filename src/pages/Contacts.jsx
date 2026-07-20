import axios from "axios";
import { API } from "../utils/path";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router";
import getApiHeaders from "../utils/helper";

export default function Contacts() {
  const token = localStorage.getItem("token");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [contactsList, setContactsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get(API.contacts, {
        headers: getApiHeaders(),
        params: {
          page: page,
          per_page: 15,
          search: debouncedSearch,
        },
      })
      .then((res) => {
        setContactsList(res.data.data);
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          total: res.data.total,
        });
      })
      .catch((err) => console.log(err, "in contacts page api call"))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [page, debouncedSearch, token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    axios
      .delete(API.deletecontact(id), {
        headers: getApiHeaders(),
      })
      .then(() =>
        setContactsList((prev) => prev.filter((contact) => contact.id !== id))
      )
      .catch((err) => console.log(err, "err in delete contact api call!"));
  };

  return (
    <div className="bg-pink-50 min-h-screen w-full px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h3 className="text-2xl text-pink-400 font-bold">Contacts List</h3>
        <Button
          text={"+ Add Contact"}
          className={"px-5 py-3  "}
          onClick={() => navigate("/create_contact")}
        />
      </div>

      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="search contact..."
          className="bg-white border-2 border-pink-400 p-2 rounded-xl w-full"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="w-full max-w-4xl mt-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <p className="text-pink-400 text-lg animate-pulse">Loading...</p>
          </div>
        ) : !contactsList || contactsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <p className="text-stone-400 text-lg">No contacts yet!</p>
            <p className="text-stone-300 text-sm">Add your first contact</p>
            <Button
              text={"+ Add Contact"}
              className={"px-5 py-3 "}
              onClick={() => navigate("/create_contact")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            {contactsList.map((contact) => (
              <div
                key={contact.id}
                className="w-full flex items-center gap-2 bg-white justify-between p-3 rounded-xl shadow-md"
              >
                <Link
                  to={`/single_contact/${contact.id}`}
                  className="w-full flex items-center gap-2 justify-between"
                >
                  <div className="flex gap-1">
                    <p>{contact.first_name}</p>
                    <p>{contact.last_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      text={"Edit"}
                      className={"p-2 rounded-[10px]"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/edit_contact/${contact.id}`);
                      }}
                    />
                    <Button
                      text={"Delete"}
                      className={"p-2 bg-red-500  rounded-[10px]"}
                      onClick={(e) => handleDelete(e, contact.id)}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && pagination.total >= 15 && (
        <div className="w-full max-w-4xl flex justify-between mt-10">
          <Button
            text={"prev"}
            disabled={pagination.current_page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-6 py-3"
          />
          <Button
            text={"next"}
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-3"
          />
        </div>
      )}
    </div>
  );
}
