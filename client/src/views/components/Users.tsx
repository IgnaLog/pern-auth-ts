import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as userService from "../../api/userService";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Users = () => {
  const [users, setUsers] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController();

    if (effectRan.current === true || import.meta.env.PROD) {
      const getUsers = async () => {
        try {
          const response = await userService.loadUsers(
            controller.signal,
            axiosPrivate
          );
          const userNames = response.data.map((user) => user.username);
          setUsers(userNames);
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      getUsers();
    }
    return () => {
      effectRan.current = true;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
