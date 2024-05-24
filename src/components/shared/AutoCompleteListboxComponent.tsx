import { PropsWithChildren, forwardRef } from "react";
import SimpleBar from "simplebar-react";

const AutoCompleteListboxComponent = forwardRef<HTMLUListElement, PropsWithChildren<any>>((props, ref) => {
  const { children, ...other } = props;
  return (
    <ul {...other} style={{ overflow: "hidden" }} ref={ref}>
      <SimpleBar style={{ height: "100%", maxHeight: "23vh" }}>
        <li>{children}</li>
      </SimpleBar>
    </ul>
  );
});
export default AutoCompleteListboxComponent;
