import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Components/HomePage/Home";
import SignupPage from "./Components/SignUpPage/SignUpPage";
import OnBoarding from "./Components/OnboardingScreen/OnBoardingMain";
import BoardBuilderPage from "./Components/Board/BoardBuilderPage";
import CreateBoard from "./Components/Board/CreateBoard";
import EditBoard from "./Components/Board/EditBoard";
import LayersPanel from "./Components/Board/ActionBar/Layers/Layers";
import { ImageProvider } from "./Components/Board/ImageContext/ImageContext";
import TapAction from "./Components/Board/ActionBar/Layers/TapAction";
import NewBoard from "./Components/Board/CreateNewBoard/NewBoard";
import ImageFromGalary from "./Components/Board/CreateNewBoard/ImageFromGalary";
import ImageFromCamera from "./Components/Board/CreateNewBoard/ImageFromCamera";
import Share from "./Components/common/Share";
import Bookmarks from "./Components/HomePage/Bookmarks";
import Ads from "./Components/Board/CreateNewBoard/ADS/Ads";
import SaveBoard from "./Components/Board/SaveBoard";
import AllCreators from "./Components/HomePage/InfoOverlayInHomepg";
import AboutPrymr from "./Components/HomePage/LongPressPopUp";
import Blank from "./Components/Blank.jsx";
import EditBoardInfo from "./Components/Board/ActionBar/BoardEditor/EditBoardInfo";
import ActionBar from "./Components/Board/ActionBar/ActionBar";
import VisitorProfile from "./Components/OnboardingScreen/SignupIn/VisitorProfile";
import Header from "./Components/common/Header";
import Navbar from "./Components/common/Navbar";
import LoginScreen from "./Components/OnboardingScreen/LoginScreen";
import SignIn from "./Components/OnboardingScreen/SignupIn/SignIn";
import BoardEdit from "./Profile Settings/BoardEdit";
import ForgetPassword from "./Components/OnboardingScreen/SignupIn/forgetPassword";
import Contact from "./Components/HomePage/Contact";
import SaveDesktopView from "./Components/Board/CreateNewBoard/SaveDesktopView";
import AddContentPage from "./Components/Board/ActionBar/Layers/AddContentPage";
import DesktopNavbar from "./Components/common/DesktopNavbar";
import InfoOverlay from "./Components/Board/ActionBar/Layers/InfoOverlay";
import LoginBen from "./Components/OnboardingScreen/SignupIn/LoginBen";
import PublicHome from "./Components/HomePage/PublicHome.jsx";
import CreatorInfo from "./Components/HomePage/CreatorInfo";
import InfoOverlayInHomepg from "./Components/HomePage/InfoOverlayInHomepg";
import VerticalActionBar from "./Components/Board/ActionBar/VerticalActionBar";
import { ToastManagerProvider } from "./Components/Context/ToastContext";
import PublishBoard from "./Components/Board/Publish Board/PublishBoard";
import { PrivateRoute } from "./Constants/urls";
import FullImageView from "./Components/Board/FullImageView";
import ResetPassword from "./Components/OnboardingScreen/SignupIn/resetPassword";
import CanclePayment from "./Components/Payments/CanclePayment";
import PaymentSuccessfull from "./Components/Payments/PaymentSuccessfull";
import BookMark from "./Components/BookMark_New/BookMark";
import KonvaCanvas from "./Components/Blank.jsx";
import WalletScreen from "./Components/Payments/WalletScreen";
import MYEarnings from "./Components/Payments/WalletScreen";
import CreatorPermissionsForm from "./Profile Settings/BecomeCreatorScreen";

function App() {
  return (
    <BrowserRouter>
      <ImageProvider>
        <ToastManagerProvider>
          <Routes>
            {/* {/ Public Routes /} */}
            {/* <Route path="/" element={<PublicHome />} /> */}
            <Route path="/" element={<Navigate to="/prymr" />} />
            <Route path="/:name" element={<Home />} />
            {/* <Route path="/" element={<BookMark />} /> */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/Ben" element={<LoginBen />} />
            <Route path="/loginscreen" element={<LoginScreen />} />
            <Route path="/signuppage" element={<SignupPage />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            {/* {/ <Route path="/" element={<OnBoarding />} /> /} */}

            {/* {/ Private Routes /} */}
            <Route element={<PrivateRoute />}>
              {/* <Route path="/ay" element={<KonvaCanvas />} /> */}
              <Route path="/ay" element={<Blank />} />

              <Route path="/infoOverlay1" element={<InfoOverlay />} />
              <Route path="/infoOverlay" element={<InfoOverlayInHomepg />} />
              <Route path="/publish" element={<PublishBoard />} />
              <Route path="/user-profile" element={<VisitorProfile />} />
              {/* <Route path="/:prymr" element={<Home />} /> */}

              <Route path="/home-about-allcreators" element={<AllCreators />} />
              <Route path="/home-about-prymr" element={<AboutPrymr />} />
              <Route path="/share" element={<Share />} />
              <Route path="/boardBuilder" element={<BoardBuilderPage />} />
              <Route path="/create-new-board" element={<NewBoard />} />
              <Route path="/create-new-board-ADS" element={<Ads />} />
              <Route path="/create-new-board-saved" element={<SaveBoard />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/info" element={<CreatorInfo />} />
              {/* <Route path="/Camera" element={<ImageFromCamera />} /> */}
              <Route path="/board-builder-edit-board" element={<EditBoard />} />
              <Route
                path="/create-new-board-edit-board-info"
                element={<EditBoardInfo />}
              />
              <Route
                path="/board-builder-actionbar-layers"
                element={<LayersPanel />}
              />
              <Route
                path="/board-builder-actionbar-image-edit"
                element={<BoardEdit />}
              />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/create/new-board/desktop-view"
                element={<SaveDesktopView />}
              />
              <Route path="/full-image-view" element={<FullImageView />} />
              <Route path="/add-content" element={<AddContentPage />} />
              <Route
                path="/paymentsuccessfull"
                element={<PaymentSuccessfull />}
              />
              <Route path="/canclepayment" element={<CanclePayment />} />
              <Route path="/infoOverlay" element={<InfoOverlay />} />
              <Route path="/my-earning" element={<MYEarnings />} />
              <Route
                path="/became-creator"
                element={<CreatorPermissionsForm />}
              />
            </Route>

            {/* {/ 404 Route /}
            {/ <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </ToastManagerProvider>
      </ImageProvider>
    </BrowserRouter>
  );
}

export default App;
