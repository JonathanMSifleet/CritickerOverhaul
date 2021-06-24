import React from 'react';

const Footer: React.FC = (): JSX.Element => {
  return (
    <>
      {/* <!-- Footer --> */}
      <footer className="bg-dark text-white">
        {/* <!-- Grid container --> */}
        <div className="container p-4">
          {/* <!-- Section: Social media --> */}
          {/* <!-- Section: Form --> */}
          <section className="">
            <form action="">
              {/* <!--Grid row--> */}
              <div className="row d-flex justify-content-center">
                {/* <!--Grid column--> */}
                <div className="col-auto">
                  <p className="pt-2">
                    <strong>Sign up for our newsletter</strong>
                  </p>
                </div>
                {/* <!--Grid column--> */}

                {/* <!--Grid column--> */}
                <div className="col-md-5 col-12">
                  {/* <!-- Email input --> */}
                  <div className="form-outline form-white mb-4">
                    <input
                      type="email"
                      id="form5Example2"
                      className="form-control"
                    />
                    <label className="form-label" htmlFor="form5Example2">
                      Email address
                    </label>
                  </div>
                </div>
                {/* <!--Grid column--> */}

                {/* <!--Grid column--> */}
                <div className="col-auto">
                  {/* <!-- Submit button --> */}
                  <button type="submit" className="btn btn-outline-light mb-4">
                    Subscribe
                  </button>
                </div>
                {/* <!--Grid column--> */}
              </div>
              {/* <!--Grid row--> */}
            </form>
          </section>
          {/* <!-- Section: Form --> */}

          {/* <!-- Section: Links --> */}
          <section className="">
            {/* <!--Grid row--> */}
            <div className="row">
              {/* <!--Grid column--> */}
              <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h5 className="text-uppercase">Links</h5>

                <ul className="list-unstyled mb-0">
                  <li>
                    <a href="#!" className="text-white">
                      Privacy Policy (implement)
                    </a>
                  </li>
                  <li>
                    <a href="#!" className="text-white">
                      Abuse Policy (implement)
                    </a>
                  </li>
                  <li>
                    <a href="#!" className="text-white">
                      Contact (implement)
                    </a>
                  </li>
                  <li>
                    <a href="#!" className="text-white">
                      About us (implement)
                    </a>
                  </li>
                  <li>
                    <a href="#!" className="text-white">
                      RSS (implement)
                    </a>
                  </li>
                  <li>
                    <a href="#!" className="text-white">
                      Terms and Conditions (implement)
                    </a>
                  </li>
                </ul>
              </div>
              {/* <!--Grid column--> */}
            </div>
            {/* <!--Grid row--> */}
          </section>
          {/* <!-- Section: Links --> */}
        </div>
        {/* <!-- Grid container --> */}

        {/* <!-- Copyright --> */}
        <div
          className="text-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        >
          Criticker.com © 2004-2021 - All Rights Reserved
        </div>
        {/* <!-- Copyright --> */}
      </footer>
      {/* <!-- Footer --> */}
    </>
  );
};
export default Footer;
