import React from "react";
import api from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const defaultImage =
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1472&auto=format&fit=crop";

  const loadProducts = async () => {
    try {
      console.log("HEllo i am at get products now .");
      const result = await api.get("/products/all");
      if (result.status == 200) {
        console.log(result.data);
        setProducts(result.data);
        console.log(products);
      } else {
        toast.error("Failed to load courses");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div>
      {products.map((e) => (
        <div className="col-12 col-md-6 col-lg-4" key={e.course_id}>
          <div className="card my-course-card h-100 shadow-sm border-0 overflow-hidden">
            {/* Image + Badge */}
            <div className="position-relative">
              <img
                src={defaultImage}0
                className="card7-img-top"
                alt="Course"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <span className="badge position-absolute top-0 end-0 bg-primary text-white px-3 py-1 m-3 fw-bold shadow-sm">
                Rs. {e.fees}
              </span>
            </div>

            {/* Card Body */}
            <div className="card-body d-flex flex-column p-4">
              <h5 className="card-title fw-bold mb-3 text-dark">
                {e.course_name}
              </h5>
              <p className="card-text text-muted small mb-4">
                {e.description ||
                  "Learn the fundamentals and advanced concepts in this comprehensive course."}
              </p>

              <div className="mt-auto mb-4">
                <div className="text-secondary small">
                  Start: <strong>{e.start_date}</strong>
                </div>
                <div className="text-secondary small">
                  End: <strong>{e.end_date}</strong>
                </div>
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={() => handleViewCourse(e)}
              >
                View Course
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
