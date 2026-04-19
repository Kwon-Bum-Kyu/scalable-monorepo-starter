import {
  Button,
  ButtonGroup,
  DatePicker,
  Empty,
  FormSelect,
  Grid,
  GridItem,
  Input,
  SimpleBreadcrumb,
  SimplePagination,
  SimpleTabs,
  Slider,
  SystemIcon,
  Typography,
} from "@repo/ui";
import React, { useState } from "react";

const Paddings = ({ children }: { children?: React.ReactNode }) => (
  <div className="p-10">{children}</div>
);

const Guide = () => {
  const [val, setVal] = useState<number[]>([50]);
  const [date, setDate] = useState<Date | undefined>();
  const [activeTab, setActiveTab] = useState("Tab 1");
  const [page, setPage] = useState(1);

  return (
    <main className="container gap-4">
      <Paddings>
        <Typography variant="h1">H1 Title</Typography>
        <Typography variant="h2">H2 Title</Typography>
        <Typography variant="h3">H3 Title</Typography>
        <Typography variant="body">
          This is a paragraph with default styles.
        </Typography>
        <Typography variant="small">This is small text.</Typography>
        <Typography variant="caption">This is caption text.</Typography>
      </Paddings>
      <Paddings>
        {/* Blue Palette */}
        <div className="bg-blue-900 p-4 text-white">Blue 900 (Active)</div>
        <div className="bg-blue-800 p-4 text-white">Blue 800 (Hover)</div>
        <div className="bg-blue-500 p-4 text-white">Blue 500 (Default)</div>
        <div className="bg-blue-50 p-4 text-black">Blue 50 (Background)</div>

        {/* Gray Palette */}
        <div className="bg-gray-900 p-4 text-white">
          Gray 900 (Primary Text)
        </div>
        <div className="bg-gray-500 p-4 text-white">Gray 500</div>
        <div className="bg-gray-200 p-4 text-black">Gray 200 (Placeholder)</div>
        <div className="bg-gray-50 p-4 text-black">Gray 50 (Background)</div>

        {/* System Colors */}
        <div className="bg-system-red p-4 text-white">Red (Error)</div>
        <div className="bg-system-green p-4 text-white">Green (Success)</div>
        <div className="bg-system-white border p-4 text-black">
          White (Background)
        </div>
      </Paddings>
      <Paddings>
        <h1 className="mb-4 text-2xl font-bold">Responsive Grid</h1>
        <Grid>
          <GridItem>1</GridItem>
          <GridItem>2</GridItem>
          <GridItem>3</GridItem>
          <GridItem>4</GridItem>
          <GridItem>5</GridItem>
          <GridItem>6</GridItem>
          <GridItem>7</GridItem>
          <GridItem>8</GridItem>
          <GridItem>9</GridItem>
          <GridItem>10</GridItem>
          <GridItem>11</GridItem>
          <GridItem>12</GridItem>
        </Grid>
      </Paddings>
      <Paddings>
        <Button variant="default">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="default" disabled>
          Disabled
        </Button>
      </Paddings>
      <Paddings>
        <div className="w-72 flex-col gap-y-10">
          {/* 텍스트 버튼 그룹 */}
          <ButtonGroup>
            <Button variant="default" onClick={() => {}}>
              Button 1
            </Button>
            <Button variant="default">Button 2</Button>
            <Button variant="default" disabled>
              Button 3
            </Button>
          </ButtonGroup>

          {/* 아이콘 버튼 그룹 */}
          <ButtonGroup>
            <Button variant="outline" size="icon">
              <Typography variant="caption">아이</Typography>
            </Button>
            <Button variant="outline" size="icon" disabled>
              <Typography variant="caption">아이</Typography>
            </Button>
          </ButtonGroup>
        </div>
      </Paddings>
      <Paddings>
        <Input placeholder="Text input" />
        <Input placeholder="Text input" aria-invalid />
        <Input placeholder="Text input" disabled />
      </Paddings>
      <Paddings>
        <FormSelect
          label="Label"
          assistiveText="Assistive text"
          placeholder="Select"
          options={[
            { label: "Item 1", value: "1" },
            { label: "Item 2", value: "2" },
            { label: "Item 3", value: "3" },
          ]}
          value={"2"}
        />

        <FormSelect
          label="Label"
          errorMessage="Error message"
          options={[{ label: "Item 1", value: "1" }]}
          value="1"
          disabled
        />

        {/* TODO(shadcn-combobox): searchable 케이스는 후속 Combobox 기획에서 재도입. 임시로 FormSelect 사용. */}
        <FormSelect
          label="Label"
          options={[
            { label: "Lorem ipsum", value: "1" },
            { label: "Irure dolor", value: "2" },
            { label: "Labor et dolore", value: "3" },
          ]}
          value={"1"}
        />
      </Paddings>
      <Paddings>
        <Slider value={val} onValueChange={setVal} />
        <span>Discrete</span>
        <Slider value={val} onValueChange={setVal} step={10} />
        <span>Disabled</span>
        <Slider value={val} onValueChange={() => {}} disabled />
      </Paddings>
      <Paddings>
        <DatePicker value={date} onSelect={setDate} />
      </Paddings>
      <Paddings>
        <SimpleBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Products" }]}
        />
      </Paddings>
      <Paddings>
        <SimpleTabs
          items={[
            { value: "Tab 1", label: "Tab 1", content: "Content 1" },
            { value: "Tab 2", label: "Tab 2", content: "Content 2" },
            { value: "Tab 3", label: "Tab 3", content: "Content 3" },
          ]}
          value={activeTab}
          onValueChange={setActiveTab}
        />
      </Paddings>
      <Paddings>
        <SimplePagination current={page} total={10} onChange={setPage} />
      </Paddings>
      <Paddings>
        <SystemIcon name="eye" size={20} />
        <SystemIcon name="close" className="text-red-500" size={20} />
        <SystemIcon name="check-circle-outline" size={24} />
      </Paddings>
      <Paddings>
        <Empty title="데이터가 없습니다" />
        <Empty title="비어있는 상태" description="추가 설명 텍스트" />
        <Empty
          title="결과 없음"
          description="검색어를 다시 확인해 주세요"
          icon={<SystemIcon name="info" size={24} />}
        />
      </Paddings>
    </main>
  );
};

export default Guide;
