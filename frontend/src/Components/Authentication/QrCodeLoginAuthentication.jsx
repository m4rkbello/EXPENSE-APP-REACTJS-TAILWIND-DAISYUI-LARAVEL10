import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { connect } from 'react-redux';
import QrScanner from 'qr-scanner';
import 'qr-scanner/qr-scanner-worker.min.js';
// import { qRCodeIsAuthenticated } from '../../redux/actions/userActions';

function QrCodeLoginAuthentication() {
  const videoRef = useRef(null);
  const navigate = useNavigate();


useEffect(() => {
  const scanner = new QrScanner(videoRef.current, result => {
    console.log("GANA NA KOL", result);

    // Add a delay of 3 seconds (adjust as needed)
    setTimeout(() => {
      // Make a POST request to the backend with the scanned QR code value
      api.post('/scan-qrcode', { email: result })
        .then(response => {
          // Handle response if needed
          console.log(response.data);
          window.location.reload();
          navigate("/home");
        })
        .catch(error => {
          // Handle error if needed
          console.error(error);
        });
    }, 10000); // 3000 milliseconds = 3 seconds
  });

  scanner.start();

  return () => {
    scanner.destroy();
  };
}, []);


  return (
    <div className="hero min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-black md:flex">
          <div className="card-body">
            <div className="form-control">
              <label className='text-2xl text-center py-4 my-4'>
                SCAN QR CODE<br />
                TO LOGIN
              </label>
              <video
                className="box-content h-64 w-64 border-4 bg-fuchsia-50"
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ objectFit: 'cover' }}
              ></video>
            </div>
            <div className='flex justify-center'>
              <label className="text-2xl mx-2">
                <Link to="/login" className="label-text-alt link link-hover">
                  Login instead?
                </Link>
              </label>
              <label className="text-3xl mx-2">
                <Link to="/register" className="label-text-alt link link-hover">
                  Create an Account?
                </Link>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default connect(null, {qRCodeIsAuthenticated})(QrCodeLoginAuthentication);
export default QrCodeLoginAuthentication;