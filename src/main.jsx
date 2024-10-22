import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import HomePage from "./pages/HomePage";
import Home from "./components/Home";
import Signup from "./pages/Signup";
import Map from "./components/map";
import Floodpred from "./components/Floodpred";
import Weatherpred from "./components/Weatherpred";
import Authprovider from "./components/Authprovider";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MakeHelpPost from "./components/MakeHelpPost";
import CreateTeam from "./components/CreateTeam";
import RescueTeamList from "./pages/RescueTeamList";
import HelpPosts from "./pages/HelpPosts";
import MyTeams from "./pages/MyTeams";
import TagedPosts from "./components/TagedPosts";
import Inbox from "./components/Inbox";


const router = createBrowserRouter([
  {
    path: "/",
    element:<HomePage></HomePage>,
    children:[
      {
        path:'/',
        element:<Home></Home>
      },
      {
        path:'/login',
        element:<Login></Login>
        
      },
      {
        path:'/signup',
        element:<Signup></Signup>
      },
      {
        path:'/profile',
        element:<Profile></Profile>
      },
      {
        path:'/map',
        element:<Map></Map>
      },
      {
        path:'/flood',
        element:<Floodpred></Floodpred>
      },
      {
        path:'/weather',
        element:<Weatherpred></Weatherpred>
      },
      {
        path:'/makepost',
        element:<MakeHelpPost></MakeHelpPost>
      },
      {
        path:'/maketeam',
        element:<CreateTeam></CreateTeam>
      },{
        path:'/rescueteamlist',
        element:<RescueTeamList></RescueTeamList>
      },
      {
        path:'/helpposts',
        element:<HelpPosts></HelpPosts>
      },
      {
        path:'/myteams',
        element:<MyTeams></MyTeams>
      },
      {
        path:'/tagedposts/:TeamsID',
        element:<TagedPosts></TagedPosts>
      },
      {
        path:'/inbox/:TeamsID',
        element:<Inbox></Inbox>
      },
      {
        path:'/floodpred/:latitude/:longitude',
        element:<Floodpred></Floodpred>
      }
      
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Authprovider>
    <RouterProvider router={router} />
    </Authprovider>
  </React.StrictMode>
);