import { UserProvider } from "./contexts/userContext";
import AppRoutes from "./AppRoutes";
import { HospitalProvider } from "./contexts/hospitalContext";

const App = () => {
  return (
    <UserProvider>
      <HospitalProvider>
        <AppRoutes />
      </HospitalProvider>
    </UserProvider>
  );
};

export default App;
