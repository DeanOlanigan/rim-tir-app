import { v4 as uuidv4 } from "uuid";

const startDate = new Date();
startDate.setDate(startDate.getDate() - 3);
startDate.setMinutes(Math.round(startDate.getMinutes() / 15) * 15);

export const getStartDate = () => startDate.getTime();

const endDate = new Date();
endDate.setDate(endDate.getDate());
endDate.setMinutes(Math.round(endDate.getMinutes() / 15) * 15);

export const getEndDate = () => endDate.getTime();

export const getRandomColor = () => {
    return (
        "#" + (Math.random().toString(16) + "000000").slice(2, 8).toUpperCase()
    );
};

export const normalizeData = (data, result = {}, parentId = null) => {
    data.forEach((element) => {
        const id = uuidv4();
        result[id] = { ...element, id, parentId };

        if (element.children) {
            result[id].children = element.children.map((child) => {
                const childId = uuidv4();
                normalizeData([child], result, childId);
                return childId;
            });
        }
    });
    return result;
};

//console.log("Normalized:", normalizeData(config.children[2].children));

export const separateData = (data, treeData = [], nodeData = {}) => {
    data.forEach((element) => {
        const { setting, children, ...rest } = element;
        nodeData[element.id] = { id: element.id, ...setting };
        if (children) {
            const newNode = { ...rest, children: [] };
            separateData(children, newNode.children, nodeData);
            treeData.push(newNode);
        } else {
            treeData.push(rest);
        }
    });
    return { treeData, nodeData };
};

//console.log("Separated:", separateData(config.children[2].children));

export const separateDataNEW = (data, nodeData = {}, parentId = null) => {
    if (!data) {
        return { treeData: null, nodeData };
    }

    const { setting, children, ...rest } = data;

    nodeData[data.id] = {
        id: data.id,
        parentId,
        name: data.name,
        setting,
        children: [],
        ...rest,
    };

    const treeData = {
        id: data.id,
        name: data.name,
        type: data.type,
        subType: data.subType,
        children: [],
    };

    if (Array.isArray(children)) {
        for (const child of children) {
            const { treeData: childNested } = separateDataNEW(
                child,
                nodeData,
                data.id
            );
            if (childNested) {
                treeData.children.push(childNested);
                nodeData[data.id].children.push(child.id);
            }
        }
    }

    return { treeData, nodeData };
};

//console.log("SEPARATED NEW", separateDataNEW(config));
