"use client";

// import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
// import TextField from "@/components/shared/TextField";
import routes from "@/helpers/routes";
import GoogleIcon from "@/icons/GoogleIcon";
import { useAuthMutation, useGoogleAuthMutation } from "@/lib/features/apis/authApi";
import { useAppSelector } from "@/lib/hooks";
import { ISignIn } from "@/types/auth";
import { signInSchema } from "@/validations/auth-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { Autocomplete, Button, TextField } from "@mui/material";

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
  {
    label: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { label: "The Good, the Bad and the Ugly", year: 1966 },
  { label: "Fight Club", year: 1999 },
  {
    label: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    label: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { label: "Forrest Gump", year: 1994 },
  { label: "Inception", year: 2010 },
  {
    label: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: "Goodfellas", year: 1990 },
  { label: "The Matrix", year: 1999 },
  { label: "Seven Samurai", year: 1954 },
  {
    label: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { label: "City of God", year: 2002 },
  { label: "Se7en", year: 1995 },
  { label: "The Silence of the Lambs", year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: "Life Is Beautiful", year: 1997 },
  { label: "The Usual Suspects", year: 1995 },
  { label: "Léon: The Professional", year: 1994 },
  { label: "Spirited Away", year: 2001 },
  { label: "Saving Private Ryan", year: 1998 },
  { label: "Once Upon a Time in the West", year: 1968 },
  { label: "American History X", year: 1998 },
  { label: "Interstellar", year: 2014 },
  { label: "Casablanca", year: 1942 },
  { label: "City Lights", year: 1931 },
  { label: "Psycho", year: 1960 },
  { label: "The Green Mile", year: 1999 },
  { label: "The Intouchables", year: 2011 },
  { label: "Modern Times", year: 1936 },
  { label: "Raiders of the Lost Ark", year: 1981 },
  { label: "Rear Window", year: 1954 },
  { label: "The Pianist", year: 2002 },
  { label: "The Departed", year: 2006 },
  { label: "Terminator 2: Judgment Day", year: 1991 },
  { label: "Back to the Future", year: 1985 },
  { label: "Whiplash", year: 2014 },
  { label: "Gladiator", year: 2000 },
  { label: "Memento", year: 2000 },
  { label: "The Prestige", year: 2006 },
  { label: "The Lion King", year: 1994 },
  { label: "Apocalypse Now", year: 1979 },
  { label: "Alien", year: 1979 },
  { label: "Sunset Boulevard", year: 1950 },
  {
    label: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { label: "The Great Dictator", year: 1940 },
  { label: "Cinema Paradiso", year: 1988 },
  { label: "The Lives of Others", year: 2006 },
  { label: "Grave of the Fireflies", year: 1988 },
  { label: "Paths of Glory", year: 1957 },
  { label: "Django Unchained", year: 2012 },
  { label: "The Shining", year: 1980 },
  { label: "WALL·E", year: 2008 },
  { label: "American Beauty", year: 1999 },
  { label: "The Dark Knight Rises", year: 2012 },
  { label: "Princess Mononoke", year: 1997 },
  { label: "Aliens", year: 1986 },
  { label: "Oldboy", year: 2003 },
  { label: "Once Upon a Time in America", year: 1984 },
  { label: "Witness for the Prosecution", year: 1957 },
  { label: "Das Boot", year: 1981 },
  { label: "Citizen Kane", year: 1941 },
  { label: "North by Northwest", year: 1959 },
  { label: "Vertigo", year: 1958 },
  {
    label: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { label: "Reservoir Dogs", year: 1992 },
  { label: "Braveheart", year: 1995 },
  { label: "M", year: 1931 },
  { label: "Requiem for a Dream", year: 2000 },
  { label: "Amélie", year: 2001 },
  { label: "A Clockwork Orange", year: 1971 },
  { label: "Like Stars on Earth", year: 2007 },
  { label: "Taxi Driver", year: 1976 },
  { label: "Lawrence of Arabia", year: 1962 },
  { label: "Double Indemnity", year: 1944 },
  {
    label: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { label: "Amadeus", year: 1984 },
  { label: "To Kill a Mockingbird", year: 1962 },
  { label: "Toy Story 3", year: 2010 },
  { label: "Logan", year: 2017 },
  { label: "Full Metal Jacket", year: 1987 },
  { label: "Dangal", year: 2016 },
  { label: "The Sting", year: 1973 },
  { label: "2001: A Space Odyssey", year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: "Toy Story", year: 1995 },
  { label: "Bicycle Thieves", year: 1948 },
  { label: "The Kid", year: 1921 },
  { label: "Inglourious Basterds", year: 2009 },
  { label: "Snatch", year: 2000 },
  { label: "3 Idiots", year: 2009 },
  { label: "Monty Python and the Holy Grail", year: 1975 },
];

const SignIn = () => {
  const router = useRouter();
  const { selectedParcelOptions } = useAppSelector((state) => state.authedUser);
  const [showPassword, setShowPassword] = useState(false);
  const [authUser, { isLoading }] = useAuthMutation();
  const [googleAuth, { isLoading: googleAuthLoading, data }] = useGoogleAuthMutation();

  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
  } = useForm<ISignIn>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: null,
      password: null,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await authUser(data).unwrap();
      toast.success("You have successfully logged in");
      router.push(selectedParcelOptions ? routes.propertySearch.signature : routes.home.root);
      localStorage.setItem("token", res.data.access_token);
    } catch (error) {
      localStorage.removeItem("token");
    }
  });

  const onGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleAuth(tokenResponse.access_token).unwrap();
        if ("access_token" in res.data) {
          toast.success("You have successfully logged in");
          router.push(selectedParcelOptions ? routes.propertySearch.signature : routes.home.root);
          localStorage.setItem("token", res.data.access_token);
        } else {
          router.push(`${routes.auth.signUp}?email=${res.data.email}&name=${res.data.name}&token=${res.data.token}`);
        }
      } catch (error) {}
    },
  });

  return (
    <>
      {/* <TextField
        label="Email"
        placeholder="Enter your email"
        name="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        onChange={(value) => setValue("email", value || null, { shouldValidate: isSubmitted, shouldDirty: isSubmitted })}
        value={watch("email") || ""}
      /> */}
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top100Films}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
      {/* <TextField
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter password"
        endIcon={
          <Button type="none" classNames="!p-0 text-dark-green" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "hidden" : "show"}
          </Button>
        }
        onChange={(value) => setValue("password", value || null, { shouldValidate: isSubmitted, shouldDirty: isSubmitted })}
        name="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        value={watch("password") || ""}
      />
      <Button onClick={onSubmit} loading={isLoading}>
        Continue
      </Button>
      <Divider label="OR" />
      <Button loading={googleAuthLoading} type="tertiary" startIcon={<GoogleIcon />} disableStartIconColor onClick={onGoogleLogin}>
        Sign in with google
      </Button>
      <Divider />
      <div className="flex items-center justify-between">
        <p>Don’t have an account yet?</p>
        <Link href={routes.auth.signUp}>
          <Button type="tertiary">Get Started</Button>
        </Link>
      </div> */}
    </>
  );
};

export default SignIn;
