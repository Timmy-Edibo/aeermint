import Link from "next/link";
import SignInForm from "./SignInForm";
import { AuthProvider } from "@/contexts/AuthContext";
export default function SignIn() {
  return (
    <>
      <AuthProvider>
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
                    <SignInForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthProvider>
    </>
  );
}
