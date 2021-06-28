import React from 'react';

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className="footer bg-primary text-center text-white fixed-bottom">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <ul className="list-group list-group-horizontal mb-0">
              <a href="#!" className="text-white">
                <li className="list-group-item bg-primary">Privacy Policy</li>
              </a>
              <a href="#!" className="text-white">
                <li className="list-group-item bg-primary">Abuse Policy</li>
              </a>
              <a href="#!" className="text-white">
                <li className="list-group-item bg-primary">Contact</li>
              </a>

              <a href="#!" className="text-white">
                <li className="list-group-item bg-primary">About Us</li>
              </a>

              <a href="#!" className="text-white">
                <li className="list-group-item bg-primary">RSS</li>
              </a>

              <a href="#!" className="text-white">
                <li className="list-group-item bg-primary">
                  Terms & Conditions
                </li>
              </a>
            </ul>
          </div>
        </div>
      </div>

      <div className="copyright text-center p-3">
        Criticker.com © 2004-2021 - All Rights Reserved
      </div>
    </footer>
  );
};
export default Footer;
