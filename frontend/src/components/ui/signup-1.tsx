import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logo as yenylethsLogo } from "@/data/productImages";

interface Signup1Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  signupText?: string;
  googleText?: string;
  loginText?: string;
  loginUrl?: string;
}

const Signup1 = ({
  heading = "Crea tu cuenta",
  logo = {
    url: "/",
    src: yenylethsLogo,
    alt: "Yenyleths Boutique",
    title: "Yenyleths Boutique",
  },
  googleText = "Registrarse con Google",
  signupText = "Crear cuenta",
  loginText = "¿Ya tienes una cuenta?",
  loginUrl = "/account",
}: Signup1Props) => {
  return (
    <section className="bg-muted min-h-[calc(100vh-1px)]">
      <div className="flex h-full items-center justify-center px-4 py-16">
        <div className="border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-y-2">
            <div className="flex items-center gap-1 lg:justify-start">
              <a href={logo.url} className="flex items-center gap-2">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-9 w-9"
                />
                <span className="font-serif text-xl font-semibold text-foreground">
                  Yenyleths Boutique
                </span>
              </a>
            </div>
            {heading && <h1 className="text-3xl font-semibold">{heading}</h1>}
          </div>
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Input type="email" placeholder="Correo electrónico" required />
              </div>
              <div className="flex flex-col gap-2">
                <Input type="password" placeholder="Contraseña" required />
              </div>
              <div className="flex flex-col gap-4">
                <Button type="submit" className="mt-2 w-full">
                  {signupText}
                </Button>
                <Button variant="outline" className="w-full">
                  <FcGoogle className="mr-2 size-5" />
                  {googleText}
                </Button>
              </div>
            </div>
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{loginText}</p>
            <a
              href={loginUrl}
              className="text-primary font-medium hover:underline"
            >
              Iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup1 };
