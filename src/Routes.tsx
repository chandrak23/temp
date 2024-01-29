import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SampleForm from "./components/Form/Myform";
import RegisterDateSource from "./components/RegisterDateSource";
import NoMatch from "./components/NoMatch";
import DrawerContainer from "./components/Common/DrawerContainer";

export default function AppRoutes() {
  return (
    <Router>
      <DrawerContainer>
        {/* Routes nest inside one another. Nested route paths build upon
              parent route paths, and nested route elements render inside
              parent route elements. See the note about <Outlet> below. */}
        <Routes>
          <Route path="/" element={<RegisterDateSource />} />
          <Route path="/form" element={<SampleForm />} />

          {/* Using path="*"" means "match anything", so this route
                  acts like a catch-all for URLs that we don't have explicit
                  routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </DrawerContainer>
    </Router>
  );
}
