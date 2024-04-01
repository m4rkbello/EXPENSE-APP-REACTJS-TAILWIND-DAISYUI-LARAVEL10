import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import 'qr-scanner/qr-scanner-worker.min.js';
import { useDispatch } from 'react-redux';
import { postAndResponseQRCode } from '../../redux/actions/userActions';

function QrCodeLoginAuthentication({postAndResponseQRCode}) {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const scanner = new QrScanner(videoRef.current, result => {
      dispatch(postAndResponseQRCode(result));
      console.log("GANA NA KOL", result);
      window.location.reload();
      navigate("/home");
    });
    scanner.start();
    return () => {
      scanner.destroy();
    };
  }, [dispatch]);

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

export default connect(null, { postAndResponseQRCode })(QrCodeLoginAuthentication);