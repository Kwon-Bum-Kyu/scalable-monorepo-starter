import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SimpleTabs,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "@repo/ui";

import { Section, TokenCard } from "@/view/guide/primitives";

export type ComponentsSectionProps = {
  sliderValue: number[];
  onSliderChange: (value: number[]) => void;
  rangeValue: number[];
  onRangeChange: (value: number[]) => void;
  activeTab: string;
  onActiveTabChange: (value: string) => void;
};

export const ComponentsSection = ({
  sliderValue,
  onSliderChange,
  rangeValue,
  onRangeChange,
  activeTab,
  onActiveTabChange,
}: ComponentsSectionProps) => (
  <Section
    id="components"
    eyebrow="Components"
    title="기본 컴포넌트"
    description="shadcn/ui 베이스 위에 KBK 브랜드 색을 입힌 핵심 컴포넌트."
  >
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <TokenCard title="Button · variants" hint="6 variants">
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </TokenCard>

      <TokenCard title="Button · sizes" hint="sm · md · lg · icon">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="아이콘 버튼">
            <span aria-hidden>★</span>
          </Button>
        </div>
      </TokenCard>

      <TokenCard title="Input · field" hint="label · hint · error">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guide-input-default">Label</Label>
            <Input id="guide-input-default" placeholder="Text input" />
            <p className="text-xs text-gray-400">Assistive text</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guide-input-error">Label</Label>
            <Input
              id="guide-input-error"
              placeholder="Text input"
              aria-invalid
            />
            <p className="text-xs text-system-red">Error message</p>
          </div>
          <Input placeholder="Text input" disabled />
        </div>
      </TokenCard>

      <TokenCard title="Selection" hint="checkbox · radio · switch">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox aria-label="checkbox" />
            Checkbox
          </label>
          <RadioGroup defaultValue="a" className="flex gap-3">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="a" aria-label="radio" />
              Radio
            </label>
          </RadioGroup>
          <label className="flex items-center gap-2 text-sm">
            <Switch aria-label="switch" />
            Switch
          </label>
        </div>
      </TokenCard>

      <TokenCard title="Slider" hint="single · range">
        <div className="flex flex-col gap-4">
          <Slider value={sliderValue} onValueChange={onSliderChange} />
          <Slider value={rangeValue} onValueChange={onRangeChange} />
        </div>
      </TokenCard>

      <TokenCard title="Badge" hint="5 variants">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
        </div>
      </TokenCard>

      <TokenCard title="Card" hint="header · body · footer">
        <Card className="shadow-2-default">
          <CardHeader>
            <CardTitle>Card 제목</CardTitle>
            <CardDescription>header · body · footer 컴포지션</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-gray-700">
              본문 영역. 길이가 길어지면 자동으로 줄바꿈됩니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              Footer 액션
            </Button>
          </CardFooter>
        </Card>
      </TokenCard>

      <TokenCard title="Toast" hint="info · success · warn · error">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Info 토스트")}
          >
            Info
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Success 토스트")}
          >
            Success
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.warning("Warning 토스트")}
          >
            Warning
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.error("Error 토스트")}
          >
            Error
          </Button>
        </div>
      </TokenCard>

      <TokenCard title="Modal" hint="dialog · drawer">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  Dialog 열기
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog 제목</DialogTitle>
                  <DialogDescription>
                    중앙 정렬 modal — focus trap · ESC 닫기 지원.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" size="sm">
                    닫기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  Drawer 열기
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Drawer 제목</SheetTitle>
                  <SheetDescription>
                    측면에서 슬라이드되는 modal — 동일 Radix primitive 컴포지션.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <p className="font-mono text-xs text-gray-400">
            dialog · drawer 는 동일 Radix primitive 위 컴포지션 패턴
          </p>
        </div>
      </TokenCard>

      <TokenCard title="Tabs · nav" hint="underline · pill">
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="a">
            <TabsList variant="underline">
              <TabsTrigger value="a">Underline A</TabsTrigger>
              <TabsTrigger value="b">Underline B</TabsTrigger>
            </TabsList>
            <TabsContent value="a">
              <p className="mt-3 text-sm text-gray-700">Underline 콘텐츠 A</p>
            </TabsContent>
            <TabsContent value="b">
              <p className="mt-3 text-sm text-gray-700">Underline 콘텐츠 B</p>
            </TabsContent>
          </Tabs>
          <SimpleTabs
            variant="pill"
            items={[
              { value: "Tab 1", label: "Pill 1", content: "Pill 콘텐츠 1" },
              { value: "Tab 2", label: "Pill 2", content: "Pill 콘텐츠 2" },
            ]}
            value={activeTab}
            onValueChange={onActiveTabChange}
          />
        </div>
      </TokenCard>
    </div>
  </Section>
);
