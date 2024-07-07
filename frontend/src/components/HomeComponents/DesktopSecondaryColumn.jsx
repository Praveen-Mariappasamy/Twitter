import {
  RequestFeed,
  NotificationInNumber,
  ContactCard,
  MobileProfileModal,
  Button,
} from "../index";
import { randomNamesWithPictures } from "../../constants/Constants";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/MyContext";
import { GoPersonAdd } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const DesktopSecondaryColumn = () => {
  const [friendReq, setFriendReq] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const toast = useToast();
  const { socket, friendReq_response } = useContext(MyContext);
  const navigate = useNavigate();
 
  // Function to fetch friend requests from the server
  const fetchFriendRequest = async () => {
    console.log("in fetch friend req");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/friend/fetchFriendRequest`,
        { withCredentials: true }
      );

      setFriendReq(data.friendRequests);
      // console.log(data.friendRequests);
    } catch (error) {
      console.log(error);
      if (error.response.data.error === "no token") {
        // alert("please login again!");
        localStorage.removeItem("userInfo");
        navigate("/signin");
      }
    }
  };

  // Fetch friend requests when the component mounts
  useEffect(() => {
    fetchFriendRequest();
  }, []);

  useEffect(() => {
    fetchFriendRequest();
  }, [friendReq_response]);
 
  //socket io
  useEffect(() => {
    socket.on("new friend request", () => {
      fetchFriendRequest();
      // console.log("got new friend request");
    });
  }, [socket]);

  //function to fetch suggested users
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/user/getSuggestedUsers`,
          { withCredentials: true }
        );
        // console.log(data.getSuggestedUsers);
        setSuggestedUsers(data.getSuggestedUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, []);

  const addFriend = async (u) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/friend/sendFriendRequest`,
        {
          recieverId: u._id,
        },
        { withCredentials: true }
      );

      toast({
        title: `${response.data.message}`,
        status: "success",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `${error.response.data.error}`,
        status: "warning",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <aside className="bg-main-shade text-text-color relative hidden w-72 flex-shrink-0 overflow-y-auto custom-scrollbar  xl:flex xl:flex-col overflow-x-hidden">
      <div className="absolute inset-0">
        <div className="h-full px-5">
          <div>
            {/* Friend Requests */}
            <div className="py-8">
              <div className="flex flex-row items-center justify-between uppercase">
                <p className="font-semibold">Recent</p>
                {/* Show the number of friend requests in a notification */}
                <NotificationInNumber
                  total={friendReq ? friendReq.length : 0}
                />
              </div>
              {/* Render friend requests or "No Friend Request" if none */}
              {!friendReq
                ? "No Friend Request"
                : friendReq?.map((user) => (
                  <RequestFeed key={user._id} user={user} />
                ))}
            </div>
            {/* Contacts */}
            <div className="flex flex-row items-center justify-between uppercase">
              <p className="font-semibold">CONTACTS</p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="py-8">
                {/* Render contact cards with name, picture, and status */}
                {suggestedUsers.map((item) => (
                  <ContactCard
                    key={item._id}
                    user={item}
                    open={isOpen}
                    setIsOpen={setIsOpen}
                    setSelectedUser={setSelectedUser}
                  />
                ))}
              </div>
              <MobileProfileModal
                open={isOpen}
                setOpen={setIsOpen}
                user={selectedUser}
              >
                <Button
                  type="button"
                  className="inline-flex items-center rounded-full border border-transparent bg-transparent text-text-color shadow-sm hover:bg-primary-shade focus:outline-none focus:ring-2 border-white p-1"
                  clickHandler={() => addFriend(selectedUser)}
                >
                  <GoPersonAdd className="h-4 w-4" aria-hidden="true" />
                </Button>
              </MobileProfileModal>

            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSecondaryColumn;
