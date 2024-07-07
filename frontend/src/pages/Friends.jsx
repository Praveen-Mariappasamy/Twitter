import { useContext, useEffect, useRef, useState } from "react";
import { FriendCard, MobileProfileModal } from "../components";
import axios from "axios";
import { randomNamesWithPictures } from "../constants/Constants";
import { MyContext } from "../context/MyContext";

const Friends = () => {
  const [friends, setFriends] = useState([]);

  // State to manage the mobile profile modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  const { socket } = useContext(MyContext);

  const fetchFriends = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/friend/fetchFriends`,
        { withCredentials: true }
      );
      console.log(data);
      setFriends(data.friends);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    socket.on("friend list updated", () => {
      fetchFriends();
    });
  }, [socket]);

  return (
    <main className="relative z-0 flex-1 overflow-y-auto  focus:outline-none   custom-scrollbar ">
      {/* Start main area */}
      <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8 ">
        <div className="h-full rounded-lg bg-main-shade">
          <div>
            <div className="text-center my-4">
              <div>
                <ul
                  role="list"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 py-5 px-5"
                >
                  {friends?.map((person) => (
                    <FriendCard
                      key={person.name}
                      person={person}
                      user={person}
                      open={isOpen}
                      setIsOpen={setIsOpen}
                      setSelectedUser={setSelectedUser}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Render the MobileProfileModal with the selected user */}
      <MobileProfileModal
        open={isOpen}
        setOpen={setIsOpen}
        user={selectedUser}
      />
      {/* End main area */}
    </main>
  );
};

export default Friends;
