import { BrowserRouter, Route, Routes } from "react-router";
import HomeView from "./views/HomeView";
import DetailUserView from "./views/DetailUserView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AuthLayout from "./layout/AuthLayout";
import HomeLayout from "./layout/HomeLayout";
import CreateFeedView from "./views/createFeedView";
import UpdateUserView from "./views/UpdateUserView";
import SearchView from "./views/SearchView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomeView />}></Route>
          <Route path="/create" element={<CreateFeedView />}></Route>
          <Route path="/:username" element={<DetailUserView />}></Route>
          <Route path="/setting" element={<UpdateUserView />}></Route>
          <Route path="/search" element={<SearchView />}></Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginView />}></Route>
          <Route path="/register" element={<RegisterView />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
