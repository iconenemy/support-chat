
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CustomLink, RoundedButtom } from "../utils/styles";
import { clearRoom } from '../features/chat/chatSlice'
import { useLogoutMutation } from "../features/auth/authApiSlice";
import { persistor } from "../app/store";

const Home = () => {
  const dispatch = useAppDispatch()
  const { is_auth, user: { role } } = useAppSelector((state) => state.persistedReducer.auth);

  const [logoutUser] = useLogoutMutation()

  const handleLogout = async () => {
    await logoutUser().unwrap().then(() => {
      persistor.purge()
      dispatch(clearRoom())
    })

  }

  return (
    <>
      {is_auth ?
        <div>
          {role === 'guest' ?
            <CustomLink to={'/chat'}>
              <RoundedButtom variant="contained">Go to chat</RoundedButtom>
            </CustomLink>
            : <CustomLink to={'/rooms'}>
              <RoundedButtom variant="contained">Go to chat</RoundedButtom>
            </CustomLink>}
          <RoundedButtom variant="contained" onClick={handleLogout}>Logout</RoundedButtom>
        </div> :
        <div>
          <CustomLink to={'/login'}>
            <RoundedButtom variant="contained">Sign In</RoundedButtom>
          </CustomLink>
          <CustomLink to={'/register'}>
            <RoundedButtom variant="contained">Sign Up</RoundedButtom>
          </CustomLink>
        </div>}
    </>
  );
};

export default Home;
