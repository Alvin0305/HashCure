import { createContext, useContext, useEffect, useState } from "react";

export const HospitalContext = createContext(null);

export const HospitalProvider = ({ children }) => {
  const [hospital, setHospital] = useState(() => {
    const storedHospital = sessionStorage.getItem("hospital");
    return storedHospital ? JSON.parse(storedHospital) : null;
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "hospital") {
        const newHospital = event.newValue ? JSON.parse(event.newValue) : null;
        setHospital(newHospital);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (hospital) {
      sessionStorage.setItem("hospital", JSON.stringify(hospital));
    } else {
      sessionStorage.removeItem("hospital");
    }
  }, [hospital]);

  return (
    <HospitalContext.Provider value={{ hospital, setHospital }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => useContext(HospitalContext);
