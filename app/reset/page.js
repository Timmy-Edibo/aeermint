import Link from "next/link";
export default function Reset() {
  return (
    <>
      <div className="authincation">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-xl-5 col-md-6">
              <div className="mini-logo text-center my-5">
                <Link href="/index">
                  <img
                    style={{ width: "20%", justifySelf: "center" }}
                    src="./images/aermint_logo_one.png"
                    alt=""
                  />
                </Link>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="">
                    <h4>Reset Password</h4>
                    <form action="#">
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label className="form-label">Email</label>
                          <input
                            name="email"
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="mt-3 d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary me-8 text-white"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                    <p className="mt-3 mb-0 undefined">
                      Already have an account?
                      <Link className="text-primary" href="/signin">
                        {" "}
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
