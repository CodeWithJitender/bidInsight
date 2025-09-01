import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

    console.log(form);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://82.112.234.104:8001/api/auth/signup/", form);
      navigate("/login");
    } catch (err) {
      alert(err.response.data.message || "Signup failed");
    }
  };

  return (
    <div className="container-fixed">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="input"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input mt-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input mt-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary mt-4">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
