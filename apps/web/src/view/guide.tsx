import {
  Breadcrumb,
  Button,
  ButtonGroup,
  DatePicker,
  Dropdown,
  Empty,
  Grid,
  GridItem,
  Input,
  Pagenation as Pagination,
  Slider,
  SystemIcon,
  Tabs,
  Typography,
} from "@repo/ui";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

const Paddings = ({ children }: { children?: React.ReactNode }) => (
  <div className="p-10">{children}</div>
);

const Guide = () => {
  const [val, setVal] = useState(50); // Continuous
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <main className="container gap-4">
      <Paddings>
        <Typography variant="h1">H1 Title</Typography>
        <Typography variant="h2">H2 Title</Typography>
        <Typography variant="large">This is a large text.</Typography>
        <Typography variant="paragraph">
          This is a paragraph with default styles.
        </Typography>
        <Typography variant="small">This is small text.</Typography>
        <Typography variant="xsmall">This is extra small text.</Typography>
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
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </Paddings>
      <Paddings>
        <div className="w-72 flex-col gap-y-10">
          {/* 텍스트 버튼 그룹 */}
          <ButtonGroup
            buttons={[
              { label: "Button 1", onClick: () => {} },
              { label: "Button 2" },
              { label: "Button 3", disabled: true },
            ]}
          />

          {/* 아이콘 버튼 그룹 (자동 감지) */}
          <ButtonGroup
            buttons={[
              { label: <Typography variant="xsmall">아이</Typography> },
              {
                label: <Typography variant="xsmall">아이</Typography>,
                disabled: true,
              },
            ]}
          />
        </div>
      </Paddings>
      <Paddings>
        <Input
          label="Label"
          placeholder="Text input"
          assistiveText="Assistive text"
        />

        <Input
          label="Label"
          placeholder="Text input"
          errorMessage="Error message"
        />

        <Input label="Label" placeholder="Text input" disabled />
      </Paddings>
      <Paddings>
        <Dropdown
          label="Label"
          assistiveText="Assistive text"
          placeholder="Select"
          options={[
            { label: "Item 1", value: "1" },
            { label: "Item 2", value: "2" },
            { label: "Item 3", value: "3" },
          ]}
          value={"2"}
          // onChange={setSelected}
        />

        <Dropdown
          label="Label"
          errorMessage="Error message"
          options={[{ label: "Item 1", value: "1" }]}
          value="1"
          disabled
        />

        <Dropdown
          label="Label"
          searchable
          options={[
            { label: "Lorem ipsum", value: "1" },
            { label: "Irure dolor", value: "2" },
            { label: "Labor et dolore", value: "3" },
          ]}
          value={"1"}
          // onChange={setValue}
        />
      </Paddings>
      <Paddings>
        <Slider value={val} onChange={setVal} />
        <span>Discrete</span>
        <Slider value={val} onChange={setVal} step={10} />
        <span>Disabled</span>
        <Slider value={val} onChange={() => {}} disabled />
        <span>Hide value</span>
        <Slider value={val} onChange={setVal} showValue={false} />
      </Paddings>
      <Paddings>
        <DatePicker
          mode="range"
          value={range}
          onChange={(val) => {
            if (!val || "from" in val) {
              setRange(val as DateRange | undefined);
            }
          }}
        />
      </Paddings>
      <Paddings>
        <Breadcrumb items={[{ label: "Home" }, { label: "Products" }]} />
      </Paddings>
      <Paddings>
        <Tabs
          tabs={["Tab 1", "Tab 2", "Tab 3"]}
          activeTab={"Tab 1"}
          onChange={() => {}}
          variant="pill"
        />
      </Paddings>
      <Paddings>
        <Pagination current={0} total={10} onChange={() => {}} />
      </Paddings>
      <Paddings>
        <SystemIcon name="eye" size={20} />
        <SystemIcon name="close" className="text-red-500" size={20} />
        <SystemIcon name="check-circle-outline" size={24} />
      </Paddings>
      <Paddings>
        <Empty type="blank" />
        <Empty type="image" />
        <Empty type="text" />
        <Empty type="image" size={48} />
        <Empty type="text" size={32} />
      </Paddings>
    </main>
  );
};

export default Guide;
