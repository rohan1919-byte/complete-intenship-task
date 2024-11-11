import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user);
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        if (!user) {
            axios.get('https://complete-intenship-task-backend.vercel.app/user', { withCredentials: true })
                .then(response => {
                    if (response.data.user) {
                        setUser(response.data.user);
                        navigate("/profile")//
                    } else {
                        navigate("/login");
                    }
                })
                .catch(() => navigate("/login"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
            navigate("/profile") //
        }
    }, [user, navigate]);

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    return (
        <center>
            <h1 style={{color:"white", fontSize:"5rem"}}>Welcome Home {user && user.name} !!!</h1>
        </center>
    );
}

export default Home;
