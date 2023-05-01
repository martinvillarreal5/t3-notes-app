import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "~/components/layout/layout";
import { api } from "~/utils/api";
import { useEffect } from "react";
import UpdateNoteForm from "~/components/notes/updateNoteForm";

const Note: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status: sessionStatus } = useSession();
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      console.log(sessionStatus);
      void router.push("/signin");
    }
  }, [router, sessionStatus]);

  const { noteId } = router.query as { noteId: string }; //TODO Find a better way?
  const { data: note, status } = api.note.getById.useQuery(
    { noteId: noteId },
    {
      enabled: sessionData?.user !== undefined,
    }
  );
  return (
    <>
      <Head>
        <title>Note detail</title>
      </Head>
      <Layout>
        {status === "loading" && (
          <h2 className=" text-xl sm:text-2xl">Loading</h2>
        )}
        {status === "success" && (
          <>
            <UpdateNoteForm note={note} />
          </>
        )}
      </Layout>
    </>
  );
};

export default Note;
