import axios from 'axios';
import { useState } from 'react';

// A hook that takes in any request from the user, processes it and returns the response along with any errors formatted correctly
// Resuable for all user api calls
export default ({ url, method, body }) => {
  // Setup errors state
  const [errors, setErrors] = useState(null);

  // Function to process the request
  const doRequest = async () => {
    try {
      // Reset errors on new request
      setErrors(null);
      // Set the method, url and body of the request taken from function call in the calling component
      const response = await axios[method](url, body);
      // If successful return the response
      return response.data;
    } catch (err) {
      // If any errors are present capture them
      // Map over the errors array and populate them into a JSX list
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops</h4>
          <ul className="my-0">
            {err.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
