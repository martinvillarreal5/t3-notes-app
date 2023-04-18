import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "~/components/layout/layout";
import { api } from "~/utils/api";
import { Trash2 as TrashIcon } from "lucide-react";
import { useEffect } from "react";

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
  const ctx = api.useContext();
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      if (note?.folderId) {
        void ctx.folder.getById.invalidate({ folderId: note.folderId });
        void router.push(`/folders/${note.folderId}`);
      } else {
        void ctx.note.getRootNotes.invalidate();
        void router.push(`/folders`);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Note detail</title>
      </Head>
      <Layout>
        {status === "loading" && (
          <h2 className=" text-2xl sm:text-3xl">Loading</h2>
        )}
        {status === "success" && (
          <>
            <h2 className=" mb-2 text-2xl sm:text-3xl">
              {note.title && note.title.length > 0
                ? note.title
                : `Note added ${note.createdAt.toLocaleString()}`}
            </h2>
            <button
              title="Delete this note"
              className="btn-square btn-sm btn mb-2"
              onClick={() => deleteNote.mutate({ noteId: note.id })}
            >
              <TrashIcon />
            </button>
            <div
              className="bg-neutral flex flex-row items-end gap-2 p-2"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {note.content}
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Note;
