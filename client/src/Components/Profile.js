import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Grid, Paper } from '@mui/material';

function Profile() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);
    const [gender, setGender] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Fetch user data if required (e.g., upon page load)
    useEffect(() => {
        axios.get('http://localhost:3001/user', { withCredentials: true })
            .then(response => {
                if (response.data.user) {
                    setName(response.data.user.name);
                    setPhone(response.data.user.phone || '');
                    setGender(response.data.user.gender || '');
                    setLinkedin(response.data.user.linkedin || '');
                } else {
                    navigate('/login'); // Redirect to login if not authenticated
                }
            })
            .catch(err => console.error(err));
    }, [navigate]);

    const validateInputs = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Name is required';
        if (!phone) newErrors.phone = 'Phone number is required';
        if (!gender) newErrors.gender = 'Gender is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('gender', gender);
        formData.append('linkedin', linkedin);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:3001/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('Profile updated successfully');
            }
        } catch (err) {
            console.error('Profile update failed', err);
        }
    };

    return (
        <Grid align="center">
            <Paper style={{ padding: '2rem', marginTop: '2rem', width: '50%' }}>
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="Phone Number"
                        fullWidth
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        label="LinkedIn Link"
                        fullWidth
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    />
                    <FormControl component="fieldset" required error={!!errors.gender}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup
                            row
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                        {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
                    </FormControl>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        style={{ marginTop: '1rem' }}
                    />
                    <Button variant="contained" type="submit" style={{ marginTop: '1rem' }}>
                        Update Profile
                    </Button>
                </form>
            </Paper>
        </Grid>
    );
}

export default Profile;
