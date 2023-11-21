import { useEffect, useState } from "react";
import {
  SafeArea,
  List,
  Card,
  Tag,
  Ellipsis,
  Toast,
  NoticeBar,
} from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";
import "./App.scss";
import { api } from "./utils";

const tagNames: Record<keyof Tag, string> = {
  info: "primary",
  normal: "success",
  warning: "warning",
  error: "danger",
};

function App() {
  const [list, setList] = useState<ListItem[]>([]);

  useEffect(() => {
    api<ListItem[]>("/list").then((data) => {
      setList(data);
    });
  }, []);

  const onHeaderClick = (path: string) => {
    console.log(path);
  };

  const onContentClick = () => {
    Toast.show("点击标题可进入测试");
  };

  return (
    <>
      <SafeArea position="top" />
      <List header="所有心理测试" className="list">
        {list.map((v) => (
          <List.Item key={v.path} className="list__item">
            <Card
              title={v.name}
              extra={<RightOutline />}
              onHeaderClick={() => onHeaderClick(v.path)}
            >
              {v.warning ? (
                <NoticeBar content={v.warning} wrap color="alert" />
              ) : null}

              <Ellipsis
                className="introduction"
                direction="end"
                rows={3}
                content={v.introduction}
                expandText="展开"
                collapseText="收起"
                onContentClick={onContentClick}
              />
              <div className="tags">
                {Object.keys(v.tags).map(
                  (k) =>
                    (v.tags[k as keyof Tag] as string[] | undefined)?.map(
                      (s, i) => (
                        <Tag key={i} round color={tagNames[k as keyof Tag]}>
                          {s}
                        </Tag>
                      ),
                    ),
                )}
              </div>
            </Card>
          </List.Item>
        ))}
      </List>
      <SafeArea position="bottom" />
    </>
  );
}

export default App;
