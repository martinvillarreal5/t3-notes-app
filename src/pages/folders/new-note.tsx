import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "~/components/layout/layout";
import CreateNoteForm from "~/components/notes/createNoteForm";

const NewNote = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      console.log(sessionStatus);
      void router.push("/signin");
    }
  }, [router, sessionStatus]);
  return (
    <>
      <Layout>
        <>
          <h2 className="mb-3 text-2xl">Create Note</h2>
          <CreateNoteForm />
        </>
      </Layout>
    </>
  );
};

export default NewNote;
