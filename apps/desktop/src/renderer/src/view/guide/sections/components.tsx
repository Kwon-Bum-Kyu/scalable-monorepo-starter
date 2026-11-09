import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Switch,
  SystemIcon,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@repo/ui";
import type React from "react";

import { GuideSection } from "@/view/guide/primitives";

const CAPTION = "font-mono text-xs text-muted-foreground";
const ROW = "flex flex-wrap items-center gap-2";
const MODAL_CAPTION = "DialogContent · 최대 폭 512px · shadow-4-overlay · 오버레이 gray-900 50%";

const CompCard = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <Card variant="flat" className="grid content-start gap-4 p-5">
    <h3 className="font-mono text-base font-semibold">{name}</h3>
    <div className="grid gap-3">{children}</div>
  </Card>
);

const Caption = ({ children }: { children: React.ReactNode }) => <p className={CAPTION}>{children}</p>;

const ButtonCard = () => (
  <CompCard name="Button">
    <Caption>variant</Caption>
    <div className={ROW}>
      <Button>default</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="outline">outline</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="destructive">destructive</Button>
      <Button variant="link">link</Button>
    </div>
    <Caption>size · sm 32 · default 40 · lg 44</Caption>
    <div className={ROW}>
      <Button variant="outline" size="sm">sm</Button>
      <Button variant="outline">default</Button>
      <Button variant="outline" size="lg">lg</Button>
    </div>
    <Caption>state · hover 90% · focus · disabled 50%</Caption>
    <div className={ROW}>
      <Button className="bg-primary/90">hover</Button>
      <Button className="ring-2 ring-ring ring-offset-2">focus</Button>
      <Button disabled>disabled</Button>
    </div>
  </CompCard>
);

const InputCard = () => (
  <CompCard name="Input">
    <div className="grid gap-1.5">
      <Label htmlFor="guide-in-default" className="font-mono text-xs font-normal text-muted-foreground">default</Label>
      <Input id="guide-in-default" placeholder="예제 제목" />
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor="guide-in-invalid" className="font-mono text-xs font-normal text-muted-foreground">aria-invalid</Label>
      <Input id="guide-in-invalid" aria-invalid="true" aria-describedby="guide-in-invalid-err" />
      <p id="guide-in-invalid-err" className="text-sm text-destructive">Title을 입력해야 저장할 수 있습니다.</p>
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor="guide-in-disabled" className="font-mono text-xs font-normal text-muted-foreground">disabled</Label>
      <Input id="guide-in-disabled" defaultValue="네 번째 예제" disabled />
    </div>
  </CompCard>
);

const SelectionCard = () => (
  <CompCard name="Selection">
    <div className="flex items-center gap-2">
      <Checkbox id="guide-checkbox" />
      <Label htmlFor="guide-checkbox">Checkbox</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroup defaultValue="a" className="flex gap-2" aria-labelledby="guide-radio-label">
        <RadioGroupItem id="guide-radio-a" value="a" aria-label="Radio 1" />
        <RadioGroupItem value="b" aria-label="Radio 2" />
      </RadioGroup>
      <Label id="guide-radio-label" htmlFor="guide-radio-a">Radio</Label>
    </div>
    <div className="flex items-center gap-2">
      <Switch id="guide-switch" />
      <Label htmlFor="guide-switch">Switch</Label>
    </div>
  </CompCard>
);

const SliderCard = () => (
  <CompCard name="Slider">
    <Slider defaultValue={[50]} aria-label="값" />
    <Caption>값</Caption>
    <Slider defaultValue={[20, 80]} aria-label="범위" />
    <Caption>범위</Caption>
  </CompCard>
);

const BadgeCard = () => (
  <CompCard name="Badge">
    <div className={ROW}>
      <Badge>default</Badge>
      <Badge variant="primary">primary</Badge>
      <Badge variant="secondary">secondary</Badge>
      <Badge variant="success">success</Badge>
      <Badge variant="warn">warn</Badge>
      <Badge variant="destructive">destructive</Badge>
      <Badge variant="outline">outline</Badge>
    </div>
    <Caption>shape · pill · sq · dot</Caption>
    <div className={ROW}>
      <Badge>pill</Badge>
      <Badge shape="sq">sq</Badge>
      <Badge variant="primary" dot>dot</Badge>
    </div>
  </CompCard>
);

const CardCard = () => (
  <CompCard name="Card">
    <Card variant="elev" className="grid gap-1 p-3">
      <p className="text-sm font-semibold">elev</p>
      <Caption>shadow-2-default</Caption>
    </Card>
    <Card variant="flat" className="grid gap-1 p-3">
      <p className="text-sm font-semibold">flat</p>
      <Caption>테두리 · 그림자 없음</Caption>
    </Card>
    <Card variant="subtle" className="grid gap-1 p-3">
      <p className="text-sm font-semibold">subtle</p>
      <Caption>테두리 · shadow-0-subtle</Caption>
    </Card>
    <Caption>CardHeader · CardContent · CardFooter 안쪽 24px</Caption>
  </CompCard>
);

const ToastCard = () => (
  <CompCard name="Toast">
    <div
      role="status"
      className="flex items-center gap-2 rounded-lg border border-gray-100 bg-background p-4 text-sm font-medium shadow-3-raised"
    >
      <SystemIcon name="octagon-x" aria-hidden />
      <span className="flex-1">알 수 없는 오류</span>
      <SystemIcon name="close" aria-hidden />
    </div>
    <Caption>Toaster · shadow-3-raised · 최대 폭 356px</Caption>
  </CompCard>
);

const ModalCard = () => (
  <CompCard name="Modal">
    <Dialog>
      <div>
        <DialogTrigger asChild>
          <Button variant="outline">Dialog</Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogTitle>Dialog</DialogTitle>
        <DialogDescription>{MODAL_CAPTION}</DialogDescription>
      </DialogContent>
    </Dialog>
    <Caption>{MODAL_CAPTION}</Caption>
  </CompCard>
);

const TabsCard = () => (
  <CompCard name="Tabs">
    <Caption>underline</Caption>
    <Tabs defaultValue="start">
      <TabsList variant="underline" className="w-full" aria-label="Tabs underline 견본">
        <TabsTrigger value="start">시작</TabsTrigger>
        <TabsTrigger value="token">토큰</TabsTrigger>
        <TabsTrigger value="component">컴포넌트</TabsTrigger>
      </TabsList>
    </Tabs>
    <Caption>pill</Caption>
    <Tabs defaultValue="start">
      <TabsList variant="pill" aria-label="Tabs pill 견본">
        <TabsTrigger value="start">시작</TabsTrigger>
        <TabsTrigger value="token">토큰</TabsTrigger>
        <TabsTrigger value="component">컴포넌트</TabsTrigger>
      </TabsList>
    </Tabs>
    <Caption>boxed</Caption>
    <Tabs defaultValue="start">
      <TabsList variant="boxed" className="w-full" aria-label="Tabs boxed 견본">
        <TabsTrigger value="start">시작</TabsTrigger>
        <TabsTrigger value="token">토큰</TabsTrigger>
        <TabsTrigger value="component">컴포넌트</TabsTrigger>
      </TabsList>
    </Tabs>
  </CompCard>
);

export const ComponentsSection = () => (
  <GuideSection id="components" eyebrow="컴포넌트" title="기본 컴포넌트">
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
      <ButtonCard />
      <InputCard />
      <SelectionCard />
      <SliderCard />
      <BadgeCard />
      <CardCard />
      <ToastCard />
      <ModalCard />
      <TabsCard />
    </div>
  </GuideSection>
);
