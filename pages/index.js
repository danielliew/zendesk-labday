import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useMemo, useState } from "react";
import Button from "../components/Button";
import Div from "../components/Div";
import { emojis } from "../components/emojis";
import Input from "../components/Input";
import LoginButton from "../components/login-btn";
import useApi from "../hooks/useApi";
import styles from "../styles/Home.module.css";

const formatDate = (d) => (d ? format(new Date(d), "do MMM yyyy") : null);

const check = (c) => (c ? emojis.check : emojis.cross);

export default function Home() {
  const jiraApi = useApi({
    path: "/api/fake-jira",
    initialData: {
      issues: [],
    },
  });

  const [input, setInput] = useState({});
  const [showDetail, setShowDetail] = useState(null);

  const get = () => {
    return {
      intro: input.intro,
      tasks: jiraApi.data.issues.map((issue) => ({
        key: issue.key,
        self: issue.self,
        summary: issue.fields.summary,
        desc: input[`${issue.id}-desc`],
        scr: input[`${issue.id}-scr`],
      })),
    };
  };

  const preview = () => {
    const data = get();
    alert(
      `intro: ${check(data.intro)}\n\n${data.tasks
        .map(
          (t) =>
            `${t.key} ${t.summary}\ndescription: ${check(
              t.desc
            )}\nscreen recording: ${check(t.scr)}`
        )
        .join("\n\n")}`
    );
  };

  const { data } = useSession();
  const { accessToken } = data || {};

  const slidesApiPath = useMemo(
    () =>
      `https://slides.googleapis.com/v1/presentations?access_token=${accessToken}`,
    [accessToken]
  );

  const slidesApi = useApi({
    path: slidesApiPath,
    initialData: {},
    method: "POST",
    triggerImmediately: false,
    options: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  const build = () => {
    slidesApi.trigger(
      JSON.stringify({
        title: "test",
        slides: [
          ...get().tasks.map((task) => ({
            pageType: "SLIDE",
            pageElements: [
              {
                shape: {
                  shapeType: "TEXT_BOX",
                  text: {
                    textElements: [
                      {
                        startIndex: 0,
                        endIndex: 1,
                        textRun: {
                          content: task.summary
                        }
                      }
                    ]
                  },
                },
              },
            ],
          })),
        ],
      })
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Div {...jiraApi} errorChild={(e) => `err: ${e}`}>
          {(data) => (
            <div>
              <div>
                <Button type="solid" onClick={build}>
                  Build intern presentation
                </Button>
                <Button type="outlined" onClick={preview}>
                  Preview presentation
                </Button>
                <LoginButton />
              </div>

              {slidesApi.data?.presentationId && (
                <div>
                  <br />
                  <Button
                    type="solid"
                    href={`https://docs.google.com/presentation/d/${slidesApi.data?.presentationId}`}
                  >
                    See presentation
                  </Button>
                  <p>{slidesApi.data?.presentationId}</p>
                </div>
              )}

              <p className={styles.description}>
                some <code className={styles.code}>config</code>
              </p>
              <Input multiline label="intro" setState={setInput} name="intro" />

              <p className={styles.description}>
                all <code className={styles.code}>jiras</code> ({data.total})
              </p>

              <div className={styles.grid}>
                {data.issues.map(({ id, key, fields }) => (
                  <div
                    key={id}
                    className={styles.card}
                    data-isshowdetail={showDetail == id}
                  >
                    <h2>
                      {key} &rarr; {fields.summary}
                    </h2>
                    <p>
                      {fields.customfield_10004} story points. Assigned to{" "}
                      {fields.assignee?.displayName}, created by{" "}
                      {fields.creator?.displayName}
                    </p>
                    <small>
                      <br />
                      {fields.customfield_10009.map((sprint) => (
                        <span key={sprint.name}>
                          {`${sprint.name} (${formatDate(
                            sprint.startDate
                          )}-${formatDate(sprint.completeDate)})`}
                          <br />
                        </span>
                      ))}
                    </small>
                    <br />
                    {showDetail === id ? (
                      <div>
                        <Button type="text" onClick={() => setShowDetail(null)}>
                          <small>hide details</small>
                        </Button>
                        <hr />
                        <Input
                          multiline
                          label="Description of the task"
                          setState={setInput}
                          name={`${id}-desc`}
                        />
                        <div>
                          <pre>
                            {JSON.stringify(fields.description, null, 2)}
                          </pre>
                        </div>
                        <Input
                          label="Screen recording link"
                          setState={setInput}
                          name={`${id}-scr`}
                        />
                        <br />
                        <a
                          href={`https://zendesk.atlassian.net/browse/${key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          view jira
                        </a>
                      </div>
                    ) : (
                      <Button type="text" onClick={() => setShowDetail(id)}>
                        <small>show details</small>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Div>
      </main>

      <footer className={styles.footer}>@danielliew Aug 2022</footer>
    </div>
  );
}
