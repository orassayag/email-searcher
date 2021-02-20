// This hoc component is serve only one purpose - To be a wrapper to a multi items component.
// In React we need to return always one root element in the component, and in order to avoid
// warping each component that have multi elements in root div that have no style and meaning,
// we wrapped the component with this hoc and in the DOM, we actually don't see it, so we save
// element DOM (Visible only in React debugging tools).

const Auxiliary = (props) => {
    return props.children;
};

export default Auxiliary;